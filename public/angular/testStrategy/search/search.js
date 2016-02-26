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

        Search.$inject = ['$scope','testStrategyService', 'errorService', 'strategyEditService', 'strategyViewService', '$q'];
        /**
         * Controller for test strategy search
         */
        function Search( $scope, searchService, errorService, editService, viewService, $q) {
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
                    action: function () {
                        //scope.$emit("LoadTestStrategyInfo", scope.searchTreeConfig.selectedInfo);
                    },
                    icon: "fa fa-info fa-fw"
                }
            ];

            vm.searchTreeConfig = {
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
                    Type: "Strategy Type",
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
                    vm.placeholder = data.placeholder;
                    vm.core = data.core;
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
                                $scope.$broadcast('LoadTreeData', {
                                    source: data,
                                    id: 1
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
            function edit(strat) {
                editService.loading = true;
                searchService.get({StrategyID: strat.StrategyID}).$promise
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
            function view(strat) {
                viewService.loading = true;
                searchService.get({StrategyID: strat.StrategyID}).$promise
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