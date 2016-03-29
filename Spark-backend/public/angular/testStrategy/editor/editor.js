/**
 * Strategy editor directive
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testStrategy.editor')
        .directive('sparkStrategyEditor', strategyEditor);

    function strategyEditor() {
        var wysiwyg = {
            menu: []
        };

        Editor.$inject = [
              '$scope',
              'strategyEditService',
              'testStrategyService',
              'testplanTreeService',
              'errorService',
              '$flash',
              '$confirm',
              '$tags',
              '$requirements',
              '$testcases'
          ];

        /**
         * Controller handling editing
         *
         * @param strategyEditService
         */
        function Editor ($scope, editService, strategyService, planTreeService, errorService, $flash, $confirm, $tags, $reqs, $testcases) {
            var vm = this;
            vm.wysiwyg = wysiwyg;
            vm.expanded = false;
            vm.textareaSize = '400px';
            vm.service = editService;
            vm.stratService = strategyService;
            vm.planTree = planTreeService;

            vm.expand = expand;
            vm.shrink = shrink;

            vm.save = save;
            vm.clear = clear;
            vm.loadRev = loadRev;
            vm.loadVar = loadVar;

            vm.createRevision = createRevision;
            vm.createVariation = createVariation;
            vm.approve = approve;
            vm.promote = promote;
            vm.demote = demote;
            //TODO: Some functionality of obsolete is not working properly.
            //Unexpected obsolete function call every time the test strategy manager editor is being clicked.
            //vm.obsolete = obsolete;

            vm.changeQual = changeQual;
            vm.deleteTag = deleteTag;
            vm.addTag = addTag;

            vm.addReqs = addReqs;
            vm.addTestcases = addTestcases;
            vm.deleteArrItem = deleteArrItem;

            vm.addToPlan = addToPlan;

            /**
             * Expand the wysiwyg editor
             */
            function expand() {
                vm.expanded = true;
            }

            /**
             * Shrink the wysiwyg editor
             */
            function shrink() {
                vm.expanded = false;
            }

            /**
             * Attempt to save the strategy
             *
             * @param {boolean} automatic Whether this is an auto-save, or triggered manually
             * @param {object} $event If automatic, the event which triggered it
             * @param {boolean} ctrl If automatic and a key-event, if the 'Ctrl' key is required to be pressed to trigger
             */
            function save(automatic, $event, ctrl) {
                // Validate the array fields
                $scope.strategy.impact.$validate();
                $scope.strategy.qual.$validate();

                if(vm.service.current && (vm.service.current.State == 'Obsolete' || vm.service.current.State == 'Approved')) {
                    errorService.warning('Strategy is approved or obsolete. Changes cannot be made to strategies in these staterequirements/requirementss.');
                }

                // TODO: Clean up if-else statements
                if (ctrl) {
                    if(!$event.ctrlKey || $event.keyCode !== 10) {
                        // Return if the ctrl key is required, but not pressed
                        return;
                    }
                } else {
                    if($event && $event.type === 'keypress' && $event.keyCode !== 13) {
                        // Skip other non-enter events
                        return;
                    }
                }

                if(automatic) {
                    if(!vm.service.current || !vm.service.current.StrategyID) {
                        // Skip saving new strategies automatically
                        return;
                    }
                } else {
                    if(vm.service.current && $scope.strategy.$invalid) {
                        // Warn if the function was manually invoked and required fields are missing
                        errorService.warning('Required field missing. Please complete the strategy before saving');
                        return;
                    }
                }

                if ($scope.strategy.$valid) {
                    // Set the approach
                    angular.forEach(vm.service.approach, function(val, key){
                        if(val.CategoryID === vm.service.current.approach) {
                            if(!Array.isArray(vm.service.current.tags_test_approach)) {
                                vm.service.current.tags_test_approach = [val];
                            } else {
                                vm.service.current.tags_test_approach[0] = val;
                            }
                        }
                    });

                    if(vm.service.current.StrategyID) {
                        // TODO: Properly handle PATCHing the object,
                        //       rather than just overwriting it all the time

                        // Save the existing strategy
                        strategyService.save(vm.service.current).$promise
                        .then(function(data) {
                            vm.service.current = data;
                            if(!automatic) {
                                errorService.success('Saved strategy');
                            } else {
                                $flash($event.target);
                            }
                        })
                        .catch(function(error) {
                            errorService.error('Error saving strategy');
                        });
                    } else {
                        // Create a new strategy
                        strategyService.new(vm.service.current).$promise
                        .then(function(data) {
                            vm.service.current = data;
                            errorService.success('Created new strategy');
                        })
                        .catch(function(error) {
                            errorService.error('Error creating strategy');
                        });
                    }
                }
            }

            /**
             * Reset the editor
             */
            function clear() {
                if(vm.service.current) {
                    $confirm({
                        content: 'This will clear any unsaved data. Are you sure?'
                    }).$promise.then(function(){
                        vm.service.current = null;
                        $scope.strategy.$setPristine();
                    });
                }
            }

            /**
             * Load the selected revision instead of the current strategy
             */
            function loadRev() {
                // TODO: implement
            }

            /**
             * Load the selected variation instead of the current strategy
             */
            function loadVar() {
                // TODO: Implement
            }

            /**
             * Create a new revision of the current strategy
             */
            function createRevision() {
                strategyService.rev({StrategyID: vm.service.current.StrategyID}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error(error);
                });
            }

            /**
             * Create a new variation of the current
             * strategy
             */
            function createVariation() {
                strategyService.vary({StrategyID: vm.service.current.StrategyID, name: ''}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error('Error creating variation point');
                });
            }

            /**
             * Approve the current strategy to core
             */
            function approve() {
                strategyService.approve({StrategyID: vm.service.current.StrategyID}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error('Error approving strategy: '+error.data.error);
                });
            }

            /**
             * Promote the current strategy to core
             */
            function promote() {
                strategyService.promote({StrategyID: vm.service.current.StrategyID}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error('Error promoting strategy: '+error.data.error);
                });
            }

            /**
             * Demote the current strategy from core
             */
            function demote() {
                strategyService.demote({StrategyID: vm.service.current.StrategyID}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error('Error demoting strategy: '+error.data.error);
                });
            }

            /**
             * Mark the current strategy as obsolete
             */
            function obsolete() {
                strategyService.obsolete({StrategyID: vm.service.current.StrategyID}).$promise
                .then(function(result) {
                    vm.service.current = result;
                })
                .catch(function(error) {
                    errorService.error('Error marking strategy obsolete: '+error.data.error);
                });
            }

            /**
             * Show the qual tag modal
             */
            function changeQual() {
                if(!vm.service.current) {
                    vm.service.current = {
                        tags_qual_area: []
                    };
                } else if (!Array.isArray(vm.service.current.tags_qual_area)) {
                    vm.service.current.tags_qual_area = [];
                }
                var modal = $tags('qual', vm.service.current.tags_qual_area);
                modal.$promise.then(function(){
                    save(true, {target: ''});
                });
            }

            /**
             * Remove the given tag from impact areas
             *
             * @param {object} tag Tag to remove from impact area
             */
            function deleteTag(tag) {
                if(vm.service.current.State == 'Obsolete' || vm.service.current.State == 'Approved') {
                    // Make no changes in read-only strats
                    return;
                }

                var index = vm.service.current.tags_impact_area.indexOf(tag);
                if(index >= 0) {
                    vm.service.current.tags_impact_area.splice(index, 1);
                    save(true, {target: ''});
                }
            }

            /**
             * Show the impact tag modal
             */
            function addTag() {
                if(!vm.service.current) {
                    vm.service.current = {
                        tags_impact_area: []
                    };
                } else if (!Array.isArray(vm.service.current.tags_impact_area)) {
                    vm.service.current.tags_impact_area = [];
                }
                var modal = $tags('impact', vm.service.current.tags_impact_area);
                modal.$promise.then(function(){
                    save(true, {target: ''});
                });
            }

            /**
             * Add the given strategy to the current plan, if any
             *
             * @param {object} item Test strategy to add to the plan
             */
            function addToPlan(item) {
                vm.planTree.add(item);
            }

            /**
             * Delete an item from an array
             * 
             * Used for requirements and testcases
             * 
             * @param {array} arr Array to delete from
             * @param {object} item Item to delete
             */
            function deleteArrItem(arr, item) {
                arr.splice(arr.indexOf(item), 1);
                save(true, {target: ''});
            }
            
            /**
             * Show the requirements modal
             */
            function addReqs() {
                if(!vm.service.current) {
                    vm.service.current = {
                        strategyRequirements: {
                            adhocs: [],
                            archdocs: [],
                            defects: [],
                            enhreqs: [],
                            implrequests: [],
                            prs: [],
                            rccas: []
                        }
                    };
                } else if (!vm.service.current.strategyRequirements) {
                    vm.service.current.strategyRequirements = {
                        adhocs: [],
                        archdocs: [],
                        defects: [],
                        enhreqs: [],
                        implrequests: [],
                        prs: [],
                        rccas: []
                    };
                }
                var modal = $reqs(vm.service.current.strategyRequirements);
                modal.$promise.then(function() {
                    save(true, {target: ''});
                });
            }

            /**
             * Show the testcases modal
             */
            function addTestcases() {
                if(!vm.service.current) {
                    vm.service.current = {
                        suggestedTestCases: {}
                    };
                } else if (!vm.service.current.suggestedTestCases) {
                    vm.service.current.suggestedTestCases = {};
                }
                var modal = $testcases(vm.service.current.suggestedTestCases);
                modal.$promise.then(function() {
                    save(true, {target: ''});
                });
            }
        }

        return {
            restrict: 'E',
            scope: {
                id: '=',
                viewer: '@'
            },
            templateUrl: 'angular/testStrategy/editor/editor.tpl.html',
            controller: Editor,
            controllerAs: 'editor',
            bindToController: true,
            link: function(scope, element, attrs, editor) {
                 // Watch for changes to the editor to grow or shrink the wysiwyg textarea
                 scope.$watch(function() {
                     return editor.expanded;
                 }, function(newVal) {
                     if(newVal) {
                         element.find('div.fullscreen').addClass('fullscreen-active');
                     }
                     else {
                         element.find('div.fullscreen').removeClass('fullscreen-active');
                     }
                 });
            }
        };
    }
})();
