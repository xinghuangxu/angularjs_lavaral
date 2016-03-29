/**
 * Services for Spark Boxcar test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-01
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.boxcar')
        .factory('boxcarTreeService', boxcarTreeService);

    /**
     * Service for handling the tree which is part of the boxcar scoping pane
     */
    function boxcarTreeService() {
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
             REQUIREMENT: {
                 value: 'ReqxID',
                 text: 'Requirement'
             },
             QUALIFICATION: {
                 value: 'QualArea',
                 text: 'Qualification Tag'
             },
             IMPACT: {
                 value: 'ImpactArea',
                 text: 'Impact Area Tag'
             },
             TYPE: {
                 value: 'ReqxType',
                 text: 'Requirement Type'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        return {
            data: null,
            config: {
                class: "boxcarPanelTree",
                popoverButtons: btns,
                groupBy: views,
                activeGroup: views.REQUIREMENT,
                attributes: {
                    QualArea: "Qualification Area Tag",
                    ImpactArea: "Impact Area Tag",
                    Type: "Strategy Type",
                    StrategyID: "StrategyID",
                    ScopePhase: "ScopePhase",
                    ScopeSize: "ScopeSize",
                    Priority: "Priority",
                    RiskMultiplier: "RiskMultiplier",
                    Complexity: "Complexity"
                }
            },
            parse: rawParser,
            buildTree: buildTree
        };

        /**
         * A simple parser for turning an arry of boxcar scoping data into
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
                for (var key in this.config.attributes) {
                    var items = parseList(data[i][key]);
                    for(var item in items) {
                        node.add(new Node({
                                text: this.config.attributes[key] + ": " + items[item]
                            },
                            NodeType.ATTRIBUTE)
                        );
                    }
                }
                jstree.push(node);
            }

            this.rawData = jstree;
        }

        /**
         * Parse a string of comma separated values into an array
         *
         *  @param {string} item String to parse
         *
         *  @return {Array} List of entries in item
         */
        function parseList (item) {
            if(item) {
                return item.split(',');
            }
            else {
                return null;
            }
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
                for(var node in this.rawData) {
                    // Get the list of groups to add this object to
                    var options = parseList(this.rawData[node].data[filter.value]);

                    for(var opt in options) {
                        // The filter field already exists in the group object, so just add this object
                        if(groups[options[opt]]) {
                            groups[options[opt]].add(this.rawData[node], true);
                        }
                        // Create a new node and add this object
                        else {
                            var type, data;

                            if(filter == views.REQUIREMENT) {
                                type = NodeType.REQUIREMENT;
                                data = this.rawData[node].data;
                            } else {
                                type = NodeType.GROUP;
                                data = {text: options[opt]}
                            }

                            var newNode = new Node(data, type);
                            newNode.add(this.rawData[node], true);
                            groups[options[opt]] = newNode;
                        }
                    }
                }

                this.data = [];
                for(var node in groups) {
                    this.data.push(groups[node]);
                }
            }
            // The filter is NONE, or a filter is not selected
            else {
                this.data = angular.copy(this.rawData);
            }

            return this.data;
        }
    };
})();
