/**
 * Module service definition for Spark testplan module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-11-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testplan')
        .factory('testplanStrategyService', testplanStrategyService)
        .factory('testplanTreeService', testplanTreeService);;

    testplanStrategyService.$inject = [ '$resource', 'testStrategyService', '$strategy'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function testplanStrategyService ($resource, strategies, $strategy) {
        var testplanStrategies = {
            open: openStrategy,
            service: $resource('/rest/planner/testplans/:plan/teststrategies/:StrategyID?', {
                plan: '@plan'
            })
        };

        return testplanStrategies;

        /**
         * Open the given strategy in the strategy editor modal
         * @param {int} stratId ID of the strategy to load
         */
        function openStrategy(stratId) {
            $strategy(stratId);
        }
    }

    testplanTreeService.$inject = ['testplanSettingsService', 'testplanStrategyService', 'errorService'];
    /**
     * Service for handling the tree which is part of the test plan scoping pane
     */
    function testplanTreeService(settingsService, strategyService, errorService) {
        var btns = [
            {
                title: "show detailed info",
                action: function () {
                    //TODO
                },
                icon: "fa fa-info fa-fw"
            },
            {
                title: "export",
                action: function () {
                    //TODO
                },
                icon: "fa fa-sign-out"
            }
        ];

        var views = {
             QUALIFICATION: {
                 value: 'tags_qual_area',
                 type: 'object',
                 index: 'CategoryID',
                 label: 'CategoryName',
                 text: 'Qualification Tag'
             },
             IMPACT: {
                 value: 'tags_impact_area',
                 type: 'object',
                 index: 'CategoryID',
                 label: 'CategoryName',
                 text: 'Impact Area Tag'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        var service = {
            data: null,
            config: {
                class: "testplanPanelTree",
                popoverButtons: btns,
                groupBy: views,
                activeGroup: views.NONE,
                attributes: {
                    tags_qual_area: "Qualification Area Tag",
                    tags_impact_area: "Impact Area Tag",
                    Type: "Strategy Type",
                    StrategyID: "StrategyID",
                }
            },
            get: getData,
            parse: rawParser,
            buildTree: buildTree,
            add: addNode,
            del: deleteNode
        };
        
        return service;
        
        /**
         * Fetch the tree data for the current plan loaded in the plan settings service
         */
        function getData() {
            service.loading = true;
            if (settingsService.data && settingsService.data.id) {
                strategyService.service.query({
                        plan: settingsService.data.id
                    }).$promise.then(function(data) {
                        service.parse(data);
                        service.buildTree();
                    }).catch(function(error) {
                        errorService.error('Error loading tree data');
                    }).finally(function(){
                        service.loading = false;
                    });
            }
        }
        

        /**
         * A simple parser for turning an arry of testplan scoping data into
         * something jstree can digest
         *
         * @param  {array} data Array of scope objects
         *
         * @return {array}      Heirarchical array of data ready for use by jstree
         */
        function rawParser (data) {
            var jstree = [];
            for(var i = 0; i < data.length; i++) {
                var node = new Node(data[i], NodeType.TEST_STRATEGY);
                for (var key in service.config.attributes) {
                    var value = data[i][key];
                    if(typeof value == 'object') {
                        for(var item in value) {
                            var child;
                            if(value[item].CategoryName) {
                                child = new Node({
                                    text: service.config.attributes[key] + ": " + value[item].CategoryName,
                                    data: value[item]
                                }, NodeType.ATTRIBUTE);
                            } else {
                                child = new Node({
                                    text: service.config.attributes[key] + ": " + value[item]
                                }, NodeType.ATTRIBUTE);
                            }
                            node.add(child);
                        }
                    } else {
                        node.add(new Node({
                                text: service.config.attributes[key] + ": " + value
                            },
                            NodeType.ATTRIBUTE));
                    }
                }
                jstree.push(node);
            }

            service.rawData = jstree;
        }

        /**
         * Build a new tree to render from the given data to fit the given filter
         *
         * @param  {array}  data    Array of scope objects
         * @param  {object} filter  Object defining the filter
         *
         * @return {array}          Heirarchical array of data ready for use by jstree
         */
        function buildTree(filter) {
            // A filter is selected
            if(filter && filter.value) {
                var groups = {};
                for(var node in service.rawData) {
                    // Get the list of groups to add this object to
                    var options = service.rawData[node].data[filter.value];

                    for(var opt in options) {
                        var optIndex, optLabel;
                        if(filter.type === 'object') {
                            optIndex = options[opt][filter.index];
                            optLabel = options[opt][filter.label];
                        } else {
                            optLabel = optIndex = options[opt];
                        }
                        // The filter field already exists in the group object, so just add this object
                        if(groups[optIndex]) {
                            groups[optIndex].add(service.rawData[node], true);
                        }
                        // Create a new node and add this object
                        else {
                            var type, data;

                            if(filter == views.REQUIREMENT) {
                                type = NodeType.REQUIREMENT;
                                data = service.rawData[node].data;
                            } else {
                                type = NodeType.GROUP;
                                data = {text: optLabel}
                            }

                            var newNode = new Node(data, type);
                            newNode.add(service.rawData[node], true);
                            groups[optIndex] = newNode;
                        }
                    }
                }

                service.data = [];
                for(var node in groups) {
                    service.data.push(groups[node]);
                }
            }
            // The filter is NONE, or a filter is not selected
            else {
                service.data = angular.copy(service.rawData);
            }

            return service.data;
        }
        
        /**
         * Add the given node to the current plan tree
         * @param {object} strategy Strategy to add as a Node
         */
        function addNode(strategy) {
            var node = new Node(strategy, NodeType.TEST_STRATEGY);
            for (var key in service.config.attributes) {
                var value = service.config.attributes[key];
                if(typeof value == 'object') {
                    for(var item in value) {
                        var child;
                        if(value[item].CategoryName) {
                            child = new Node({
                                text: service.config.attributes[key] + ": " + value[item].CategoryName,
                                data: value[item]
                            }, NodeType.ATTRIBUTE);
                        } else {
                            child = new Node({
                                text: service.config.attributes[key] + ": " + value[item]
                            }, NodeType.ATTRIBUTE);
                        }
                        node.add(child);
                    }
                } else {
                    node.add(new Node({
                            text: service.config.attributes[key] + ": " + value
                        },
                        NodeType.ATTRIBUTE));
                }
            }
            
            if(Array.isArray(service.data)) {
                service.data.push(node);
            } else {
                service.data = [node];
            }
            
            strategyService.service.save({
                    plan: settingsService.data.id
                }, strategy).$promise
                .then(function(data) {
                    errorService.success('Added strategy to plan');
                })
                .catch(function(error) {
                    errorService.error('Error associating strategy to plan');
                });
        }
        
        /**
         * Remove a node from the tree
         * 
         * @param {object} node Node to remove
         */
        function deleteNode(node) {
            var index = null;
            angular.forEach(service.rawData, function (val, key) {
                if(val.data.StrategyID === node.StrategyID) {
                    index = key;
                };
            });
            if(index !== null) {
                strategyService.service.remove({plan: settingsService.data.id, StrategyID: node.StrategyID}).$promise
                    .then(function() {
                        service.rawData.splice(index, 1);
                        buildTree();
                    }).catch(function(error) {
                        errorService.error('Error removing strategy from plan');
                    });
            }
        }
    }
})();
