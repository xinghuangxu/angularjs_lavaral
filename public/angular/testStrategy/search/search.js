/**
 * Strategy search directive
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-09
 *
 */

(function () {
    'use strict';

    angular
            .module('spark.testStrategy.search')
            .directive("sparkStrategySearch", strategySearch);

    /**
     * Directive for test strategy search pane
     */
    function strategySearch() {

        Search.$inject = ['$scope', 'testStrategyService', 'errorService', 'strategyEditService', 'strategyViewService', '$q'];
        /**
         * Controller for test strategy search
         */
        function Search($scope, searchService, errorService, editService, viewService, $q) {
            var vm = this;

            // Set the default panel to be open to the search panel
            vm.activePanel = 3;

            vm.core = [];
            vm.search = [];
            vm.placeholder = [];
            vm.suggested = [];
            vm.loading = {
                search: false,
                core: false,
                placeholder: false,
                suggested: false
            };

            vm.edit = edit;
            vm.view = view;
            vm.search = search;
            vm.editService = editService;
            vm.viewService = viewService;

            //button in the jstree popover
            var btns = [
                {
                    title: "show detailed info",
                    action: function (treeConfig) {
                        view(treeConfig.selectedInfo.id);
                    },
                    icon: "fa fa-info fa-fw"
                },
                {
                    title: "edit",
                    action: function (treeConfig) {
                        edit(treeConfig.selectedInfo.id);
                    },
                    icon: "glyphicon glyphicon-pencil"
                }
            ];
            $scope.placeholderTreeConfig = {
                watch: "placeholderTreeData",
                id: 2,
                parser: "testStrategyDataParserService",
                class: "testStrategySearchTree",
                popoverButtons: btns,
                classifiers: [
//                    {"value": 'QualificationArea', "text": "Qualification Tag"},
//                    {"value": 'ImpactArea', "text": "Impact Area Tag"},
//                    {"value": 'Approach', "text": "Approach Tag"},
//                    {"value": 'CreatedDate', "text": "Creation Date"},
//                    {"value": 'CreatedBy', "text": "Created By"},
                    {"value": '', "text": "None"},
                    {"value": 'ModifiedDate', "text": "Last Modification Date"},
//                    {"value": 'ModifiedBy', "text": "Last Modified By"},
                    {"value": 'Owner', "text": "Owner"},
                    {"value": 'State', "text": "State"}
                ],
                attributes: {
                    StrategyHeadline: "Strategy Title",
//                    QualificationArea: "Qualification Area Tag",
//                    ImpactArea: "Impact Area Tag",
//                    Approach: "Approach",
//                    CreatedDate: "Creation Date",
//                    CreatedBy: "Created By",
                    ModifiedDate: "Last Modification Date",
//                    ModifiedBy: "Last Modified By",
                    Owner: "Owner",
                    State: "State",
                    Type: "Strategy Type"
//                    TopicID: "TPID"
                }
            };
            $scope.coreTreeConfig = {
                id: 3,
                parser: "testStrategyDataParserService",
                class: "testStrategySearchTree",
                popoverButtons: btns,
                classifiers: [
//                    {"value": 'QualificationArea', "text": "Qualification Tag"},
//                    {"value": 'ImpactArea', "text": "Impact Area Tag"},
//                    {"value": 'Approach', "text": "Approach Tag"},
//                    {"value": 'CreatedDate', "text": "Creation Date"},
//                    {"value": 'CreatedBy', "text": "Created By"},
                    {"value": '', "text": "None"},
                    {"value": 'ModifiedDate', "text": "Last Modification Date"},
//                    {"value": 'ModifiedBy', "text": "Last Modified By"},
                    {"value": 'Owner', "text": "Owner"},
                    {"value": 'State', "text": "State"}
                ],
                attributes: {
                    StrategyHeadline: "Strategy Title",
//                    QualificationArea: "Qualification Area Tag",
//                    ImpactArea: "Impact Area Tag",
//                    Approach: "Approach",
//                    CreatedDate: "Creation Date",
//                    CreatedBy: "Created By",
                    ModifiedDate: "Last Modification Date",
//                    ModifiedBy: "Last Modified By",
                    Owner: "Owner",
                    State: "State",
                    Type: "Strategy Type"
//                    TopicID: "TPID"
                }
            };
            $scope.searchTreeConfig = {
                watch: "searchTreeData",
                id: 1,
                parser: "testStrategyDataParserService",
                class: "testStrategySearchTree",
                popoverButtons: btns,
                classifiers: [
//                    {"value": 'QualificationArea', "text": "Qualification Tag"},
//                    {"value": 'ImpactArea', "text": "Impact Area Tag"},
//                    {"value": 'Approach', "text": "Approach Tag"},
//                    {"value": 'CreatedDate', "text": "Creation Date"},
//                    {"value": 'CreatedBy', "text": "Created By"},
                    {"value": '', "text": "None"},
                    {"value": 'ModifiedDate', "text": "Last Modification Date"},
//                    {"value": 'ModifiedBy', "text": "Last Modified By"},
                    {"value": 'Owner', "text": "Owner"},
                    {"value": 'State', "text": "State"}
                ],
                attributes: {
                    StrategyHeadline: "Strategy Title",
//                    QualificationArea: "Qualification Area Tag",
//                    ImpactArea: "Impact Area Tag",
//                    Approach: "Approach",
//                    CreatedDate: "Creation Date",
//                    CreatedBy: "Created By",
                    ModifiedDate: "Last Modification Date",
//                    ModifiedBy: "Last Modified By",
                    Owner: "Owner",
                    State: "State",
                    Type: "Strategy Type"
//                    TopicID: "TPID"
                }
            };

            activate();

            /**
             * Initialize the controller
             */
            function activate() {
                vm.loading.core = vm.loading.placeholder = true;
                $q.all({
                    placeholder: searchService.query({type: 'p,s'}).$promise,
                    core: searchService.query({type: 'c'}).$promise
                }).then(function (data) {
                    setTimeout(function () {
                        vm.placeholder = data.placeholder;
//                    $scope[$scope.placeholderTreeConfig.watch] = data.placeholder;
                        $scope.$broadcast('LoadTreeData' + 2, {
                            source: data.placeholder
                        });
                        vm.core = data.core;
//                    $scope[$scope.searchTreeConfig.watch] = data.core;
                        $scope.$broadcast('LoadTreeData' + 3, {
                            source: data.core
                        });
                    }, 1000);

                }).finally(function () {
                    vm.loading.core = vm.loading.placeholder = false;
                });
            }

            /**
             * Search the database for strategies
             * 
             * @param {object} $event Optional event for handling keypress events
             */
            function search($event) {
                if (!$event || ($event && event.keyCode === 13)) {
                    vm.results = [];
                    vm.loading.search = true;

                    searchService.query({search: vm.searchTerm}).$promise
                            .then(function (data) {
                                vm.results = data;
                                $scope.$broadcast('LoadTreeData' + 1, {
                                    source: data
                                });
                            })
                            .catch(function (error) {
                                errorService.error("Problem searching for strategies")
                            }).finally(function () {
                        vm.loading.search = false;
                    });
                }
            }

            /**
             * Open the given strategy in the editor panel
             * 
             * Fetches full details from the server
             * 
             * @param {object} strat Strategy to edit
             */
            function edit(strategyID) {
                editService.loading = true;
                searchService.get({StrategyID: strategyID}).$promise
                        .then(function (data) {
                            vm.editService.current = data;
                        })
                        .catch(function (error) {
                            errorService.error("Problem loading strategy details")
                        })
                        .finally(function () {
                            editService.loading = false;
                        });
            }

            /**
             * Open the given strategy in the view panel
             * 
             * Fetches full details from the server
             * 
             * @param {object} strat Strategy to edit
             */
            function view(strategyID) {
                viewService.loading = true;
                searchService.get({StrategyID: strategyID}).$promise
                        .then(function (data) {
                            vm.viewService.current = data;
                        })
                        .catch(function (error) {
                            errorService.error("Problem loading strategy details")
                        })
                        .finally(function () {
                            viewService.loading = false;
                        });
            }
        }

        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'angular/testStrategy/search/search.tpl.html',
            controller: Search,
            controllerAs: 'search',
            bindToController: true,
            link: function (scope, element, attrs, search) {
            }
        };
    }
})();