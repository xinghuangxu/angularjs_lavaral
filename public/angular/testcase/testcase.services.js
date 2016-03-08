/**
 * Module service definition for Spark testcase module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testcase')
        .factory('testcaseService', testcaseService)
        .service('$testcases', testcaseModalService)
        .factory('TestCaseAService', TestCaseAService)
        .factory('TestCaseTreeService', TestCaseTreeService);

    testcaseService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about tags
     */
    function testcaseService ($resource){
        return $resource('/rest/alm/testCases');
    }

    testcaseModalService.$inject = ['$rootScope', '$modal', '$timeout', '$q'];
    /**
     * Service provider for modal dialogs to select testcases
     */
    function testcaseModalService($rootScope, $modal, $timeout, $q) {
        return function(dest) {
            var modalScope = $rootScope.$new();
            modalScope.add = addTestcase;
            modalScope.dest = dest;

            var modal = $modal({
                title: 'Add Test Cases From ALM',
                contentTemplate: '/angular/testcase/testcaseModal.tpl.html',
                controller: 'AddTestCase',
                controllerAs: 'testcase',
                scope: modalScope
            });
            var deferred = $q.defer();
            modal.$promise = deferred.promise;

            var parentHide = modal.hide;
            modal.hide = hide;

            return modal;

            /**
             * Return the testcase to the parent controller
             *
             * @param {object} testcase Testcase to send back
             * @param {array} dest Array to append data to
             */
            function addTestcase(db, testcase) {
                if(!modalScope.dest) {
                    // No target given
                    return;
                }

                if(!modalScope.dest.hasOwnProperty(db)) {
                    modalScope.dest[db] = [testcase];
                    testcase.added = true;
                } else {
                    modalScope.dest[db].push(testcase);
                    testcase.added = true;
                }
            }

            /**
             * Hide the modal
             */
            function hide() {
                deferred.resolve(true);
                parentHide();
            }
        }
    }

    TestCaseAService.$inject = [ '$resource'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function TestCaseAService ($resource) {
        var archdocs = {
            service: $resource('http://localhost:8000/json/get-rest.requirements.archdocs.json')
        };

        return archdocs;
    }

    TestCaseTreeService.$inject = ['TestCaseAService', 'errorService'];
    /**
     * Service for handling the tree which is part of the test plan scoping pane
     */
    function TestCaseTreeService(TestCaseAService, errorService) {
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
             CREATIONDATE: {
//                 value: 'tags_qual_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Creation date'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        var service = {
            data: null,
            config: {
                class: "archdocsPanelTree",
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
        };

        return service;

        /**
         * Fetch the tree data for the current plan loaded in the plan settings service
         */
        function getData() {
            service.loading = true;
            TestCaseAService.service.query().$promise
                    .then(function(data){
                        service.data = data;
                        service.parse(data);
                        service.buildTree();
                    })
                    .catch(function() {
                        errorService.error('Error loading tree data');
                    })
                    .finally(function (){
                        service.loading = false;
                    });
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
    }
})();
