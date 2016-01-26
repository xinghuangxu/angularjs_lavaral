/**
 * Controllers for Spark test planning Settings module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.settings')
        .controller('SettingsPopover', SettingsPopover)
        .controller('SettingsModal', SettingsModal)
        .controller('SettingsALM', SettingsALM);


    SettingsPopover.$inject = [ '$scope', 'testplanSettingsService', 'testplanSettingsModalService' ];

    /**
     * Controller for quick-view popover of the current settings for the test planner
     *
     * @param {object} $scope   Controller's scope
     * @param {object} settings Service reference for fetching data about the current settings
     * @param {object} modal    Service reference for the modal dialog to edit the settings
     */
    function SettingsPopover ($scope, settings, modal) {
        var vm = this;

        vm.data = settings.data;
        vm.edit = edit;
        vm.modal = modal.modal;

        /**
         * Open the edit modal to make changes
         */
        function edit () {
            vm.modal.show();

            $scope.$hide();
        };
    }

    SettingsModal.$inject = [ '$scope', 'testplanSettingsService', 'testplanSettingsModalService' ];

    /**
     * Controller for the modal dialog to edit the settings for the current test plan
     *
     * @param {object} $scope   Controller's scope
     * @param {object} settings Service reference for fetching data about the current settings
     * @param {object} modal    Service reference for the modal dialog to edit the settings
     */
    function SettingsModal ($scope, settings, modal) {
        var vm = this;
        vm.modal = modal.modal;

        // Load settings and view information
        vm.data = settings.data;

        vm.tabs = [
             {
                 title: 'Basic Info',
                 template: "angular/planner/settings/modal-basic.tpl.html"
             },
             {
                 title: 'ALM',
                 template: "angular/planner/settings/modal-alm.tpl.html"
             },
             /* Rally connection not working yet
             {
                 title: 'Rally',
                 template: "planner/settings/modal-rally.html"
             }
             */
        ];

        vm.tabs.activeTab = 0;
    }

    SettingsALM.$inject = [ '$scope', '$alert', 'testplanSettingsService', 'almFolderService' ];

    /**
     * Specific handler for ALM settings within the {@link Modal} dialog
     *
     * @param {object} $scope           Controller's scope
     * @param {[type]} $alert           Service reference for popping up alert messages (from ngStrap)
     * @param {object} settings         Service reference for fetching data about the current settings
     * @param {object} almFolderData    Service reference for the modal dialog to edit the settings
     */
    function SettingsALM ($scope, $alert, settings, almFolderData) {
        var vm = this;

        vm.data = settings.data;
        vm.loadNode = loadNode;

        // Load the correct tree whenever a new database is selected
        $scope.$watch(function() {
                return vm.data.alm_db_name;
            },
            function(domain, oldVal) {
                // Domain is not set, so exit without trying to fetch
                if(!domain)
                    return;

                // Reset the folder value if the domain has changed
                if(domain !== oldVal) {
                    vm.data.alm_folder = "";
                    vm.data.alm_folder_node_id = null;

                    $.each(vm.almDomains, function(key, value) {
                        if(value.name === domain)
                            vm.data.alm_db_description = value.description;
                    })
                }

                vm.loading = true;

                // Get new domain root
                almFolderData.folders({ database: domain }).$promise
                    .then(function(val, response) {
                        vm.treeData = val;
                        vm.loading = false;
                    })
                    .catch(function(response) {
                        // Warn the user
                        $alert({
                            title: "Error fetching ALM folders",
                            content: "There was an error fetching the list of folders from the " + domain + " domain.",
                            placement: 'top',
                            container: '.modal-dialog'
                        });
                        vm.loading = false;
                    });
            }
        );

        activate();

        /**
         * Add the list of children to the tree at the specified node
         *
         * @param  {object} start     Root of the tree to search through
         * @param  {int}    targetId  ID of the node to append data to
         * @param  {object} children  List of children to append to the node
         *
         * @return {object}           Final node that the children have been appended to
         */
        function appendChildren (start, targetId, children) {
            for(var child in start) {
                if(start[child].id === targetId) {
                    start[child].children = children;
                    break;
                } else {
                    appendChildren(start[child].children, targetId, children);
                }
            }

            return start;
        }

        /**
         * Fetch the data for a node and add it to the tree
         *
         * @param  {object} data Event data containing the ID of the node to load data for
         */
        function loadNode (data) {
            // Must have the event data
            // A quirk in jstree fires the event twice; once with, once without
            if(!data.event)
                return;

            // Update the selected path
            var parents = data.instance.get_path(data.node.id);
            vm.data.alm_folder =  "\\" + parents.join("\\");
            vm.data.alm_folder_node_id = data.node.id;
            
            if(data.node.original.hasChildren && (!data.node.children || data.node.children.length < 1)) {
                // Load the new data from the almFolderData service if there are children to load 
                vm.loading = true;
                almFolderData.folders({
                        database: vm.data.alm_db_name,
                        folderId: data.node.id
                    }).$promise
                        .then(function(val, response) {
                            vm.treeData = appendChildren(vm.treeData, data.node.id, val);
                            vm.loading = false;
                        })
                        .catch(function(response) {
                            $alert({
                                title: "Error fetching ALM folders",
                                content: "There was an error fetching the list of subfolders for " + data.node.text + ".",
                                placement: 'top',
                                container: '.modal-dialog'
                            });
                            vm.loading = false;
                        });
            } else {
                // Force the scope to update since one isn't being triggered to update UI fields.
                $scope.$apply();
            }
        };

        /**
         * Initialize the controller by fetching data
         */
        function activate () {
            almFolderData.query().$promise
                .then(function(val, response) {
                    vm.almDomains = val;
                })
                .catch(function(response) {
                    $alert({
                        title: "Error fetching ALM domains",
                        content: "There was an error fetching the list of ALM domains from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                }
            );
        }
    }
})();
