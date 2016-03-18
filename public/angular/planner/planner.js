/**
 * Primary controllers for the test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */
(function () {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
            .module('spark.planner')
            .controller('Main', Main)
            .controller('Releases', Releases)
            .controller('Panes', Panes);

    Main.$inject = ['globalFilterService'];
    /**
     * Controller for the test planner page
     */
    function Main(filter) {
        var vm = this;

        vm.filter = filter;
    }

    Releases.$inject =  [ '$scope', 'testplanSettingsService',  'releasesService', 'testStackService','$rootScope' ];

    /**
     * Controller for handling the release selection for settings
     *
     * @param {object} $scope   Controller's scope
     * @param {object} settings Service reference for fetching settings data
     * @param {object} releases Service reference for fetching release data
     * @param {object} stacks   Service reference for fetching stack layer data
     */
    function Releases ($scope, planSettings, releases, stacks,$rootScope ) {
        var vm = this;

        vm.releases = releases.query();
        vm.stackLayers = [];
        vm.subLayers = [];
        vm.settings = planSettings;
        vm.data = vm.settings.data;

        // Watch for changes to the train and update the list of test stack layers
        $scope.$watch(function () {
            return vm.data.release_id;
        },
                function () {
                    if (vm.data.release_id) {
                        planSettings.service.query({
                            release: vm.data.release_id,
                            stack: '',
                            substack: ''
                        },
                                function (data) {
                                    if (data.length > 0)
                                        planSettings.data = data[0];
                                });
                    }

                    // TODO: Call relevant data service when value changes
                    vm.data.testplan_stack_id = null;
                    vm.data.testplan_substack_id = null;

                    if (vm.data.release_id)
                        vm.stackLayers = stacks.stack.asOptions({release: vm.data.release_id});
                }
        );

        // Watch for changes to the test stack layer and update the list of sub-layers
        $scope.$watch(function() {
                return vm.data.testplan_stack_id;
            },
            function() {
                if(vm.data.testplan_stack_id) {
                    planSettings.service.query({
                        release: vm.data.release_id,
                        stack: vm.data.testplan_stack_id,
                        substack: ''
                    },
                    function(data) {
                        if(data.length > 0) {
                            planSettings.data = data[0];
                            if(planSettings.data.boxcar) {
                                planSettings.data.testplan_stack_id = planSettings.data.boxcar.id;
                                planSettings.data.stack_name = planSettings.data.boxcar.Name;
                            } else {
                                planSettings.data.stack_name = planSettings.data.stack?planSettings.data.stack.name:'';
                            }
                             $rootScope.$broadcast('planSettingChanged',planSettings);
                        }
                    });
                }

                    // TODO: Call relevant data service when value changes
                    vm.data.testplan_substack_id = null;

                    if (vm.data.testplan_stack_id)
                        vm.subLayers = stacks.substack.asOptions({stack: vm.data.testplan_stack_id});
                }
        );

        // Wait for changes in the test plan substack
        $scope.$watch(function () {
            return vm.data.testplan_substack_id;
        },
                function () {
                    if (vm.data.testplan_substack_id) {
                        planSettings.service.query({
                            release: vm.data.release_id,
                            stack: vm.data.testplan_stack_id,
                            substack: vm.data.testplan_substack_id
                        },
                                function (data) {
                                    if (data.length > 0) {
                                        planSettings.data = data[0];

                                if(planSettings.data.boxcar) {
                                    planSettings.data.testplan_stack_id = planSettings.data.boxcar.id;
                                    planSettings.data.stack_name = planSettings.data.boxcar.Name;
                                } else {
                                    planSettings.data.stack_name = planSettings.data.stack?planSettings.data.stack.name:'';
                                }


                                planSettings.data.substack_name = planSettings.data.substack?planSettings.data.substack.name:'';
                                $rootScope.$broadcast('planSettingChanged',planSettings);
                            }
                        }
                    );
                }
                }
        );
    }

    Panes.$inject = ['$scope','errorService'];

    /**
     * Controller for handling the panels which show the actual content in the planner
     */
    function Panes($scope,errorService) {
        var vm = this;

        vm.order = 'order';
        vm.sortableOptions = {
            handle: '.sort-handle',
            scroll: false,
            cursor: 'move',
            placeholder: 'pane panel panel-primary panel-placeholder'
        };

        vm.active = function (item) {
            return item.active;
        };

        vm.paneGroups = [
            {
                label: 'What',
                name: 'what',
                order: 0
            },
            {
                label: 'Where',
                name: 'where',
                order: 1
            },
            {
                label: 'When',
                name: 'when',
                order: 2
            }
        ];


        // Setup the defaults and configuration for each pane
        // Each template must contain a reference to the correct controller for that pane
        vm.panes =  [
            {
                label: "High Level scope",
                template: "angular/planner/boxcar/boxcar.tpl.html",
                order: 0,
                active: false,
                group: 'what'
            },
            {
                label: "SOW",
                //template: "planner/sow/sow.tpl.html",
                template: "angular/planner/comingSoon.tpl.html",
                order: 1,
                active: false,
                group: 'what'
            },
            {
                label: "Architecture Documents",
                //template: "planner/sow/archDocs.tpl.html",
                //template: "angular/planner/empty.tpl.html",
                template: "angular/archdocs/archDocs.tpl.html",
                order: 2,
                active: false,
                group: 'what'
            },
            {
                label: "Rally",
                //template: "planner/rally/rally.tpl.html",
                template: "angular/rally/rallyModal.tpl.html",
                order: 3,
                active: false,
                group: 'when'
            },
            {
                label: "Test Plan",
                template: "angular/planner/testplan/testplan.tpl.html",
                order: 4,
                active: false,
                group: 'what'
            },
            {
                label: "Configuration Plan",
                //template: "planner/configPlan/configPlan.tpl.html",
                template: "angular/planner/comingSoon.tpl.html",
                order: 5,
                active: false,
                group: 'where'
            },
            {
                label: "Test Cases",
                //template: "planner/alm/alm.tpl.html",
                //template: "angular/testcase/testcaseModal.tpl.html",
                template: "angular/testcase/testcase.tpl.html",
                order: 6,
                active: false,
                group: 'what'
            },
            {
                label: "WebLab",
                //template: "planner/weblab/weblab.tpl.html",
                template: "angular/planner/comingSoon.tpl.html",
                order: 7,
                active: false,
                group: 'where'
            },
            {
                label: "Test Case Instances",
                //template: "planner/weblab/weblab.tpl.html",
                template: "angular/testcaseinstance/testcaseinstance.tpl.html",
                order: 8,
                active: false,
                group: 'what'
            },
            {
                label: "RCCA",
                //template: "planner/weblab/weblab.tpl.html",
                template: "angular/planner/comingSoon.tpl.html",
                order: 9,
                active: false,
                group: 'what'
            },
            {
                label: "Implementation Requests",
                //template: "planner/weblab/weblab.tpl.html",
                template: "angular/implementreq/implementReq.tpl.html",
                order: 10,
                active: false,
                group: 'what'
            }, 
            {
                label: "Continuous integration",
                //template: "planner/weblab/weblab.tpl.html",
                template: "angular/continuousintegration/ci.tpl.html",
                order: 11,
                active: true,
                group: 'what'
            }
        ];
        
        //multi select configuration and watch events
        vm.selectedPanes = [];
        for (var i = 0; i < vm.panes.length; i++) {
            if(vm.panes[i].active){
                vm.selectedPanes.push(vm.panes[i].label);
            }
        }
        vm.panelLimits = 3;
        $scope.$watch(
                function () {
                    return vm.selectedPanes;
                },
                function () {
                    if (vm.selectedPanes.length <= vm.panelLimits) {
                        for (var i = 0; i < vm.panes.length; i++) {
                            var isSelected = (vm.selectedPanes.indexOf(vm.panes[i].label) > -1);
                            if (isSelected) {
                                vm.panes[i].active = true;
                            } else {
                                vm.panes[i].active = false;
                            }
                        }
                    }else{
                        errorService.warning("You can only select max " + vm.panelLimits + " panels at a time. Please remove a panel to add a new one.");
                    }
                }
        );
    }
})();
