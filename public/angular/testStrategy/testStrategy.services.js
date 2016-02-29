/**
 * Module service definition for Spark test strategy module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function () {
    'use strict';

    angular
            .module('spark.testStrategy')
            .factory('testStrategyService', testStrategyService)
            .service('$strategy', testStrategyModalService)
            .factory('testStrategyDataParserService', testStrategyDataParserService);

    function testStrategyDataParserService() {
        var testStrategyParser = {};
        var testStrategyList = [];
        var attributeList;
        var NodeType = {
            ARRANGE_BY: 0,
            TEST_STRATEGY: 1,
            ATTRIBUTE: 2,
            TEST_CASE: 3
        };
        var nameMap = {
            "TopicID": "TopicID",
            "State": "State",
            "CreatedBy": "CreatedBy",
            "CreatedDate": "CreatedDate",
            "ModifiedBy": "ModifiedBy",
            "ModifiedDate": "ModifiedDate",
            "StrategyHeadline": "StrategyHeadline",
            "Owner": "Owner",
            "Approach": "Approach",
            "Type": "Type",
            "QualificationArea": "categories",
            "ImpactArea": "categories",
            "Requirements": "requirements"
        };

        var iconPath = "assets/img/strategy";
        function Node(data, type) {
            this.children = {};
            if (type === NodeType.TEST_STRATEGY) { //test strategy node
                this.id = data['TopicID'];
                this.text = data['StrategyHeadline'];
                this.attrs = {
                };
                for (var key in nameMap) {
                    if (nameMap.hasOwnProperty(key)) {
                        var value = "";
                        if (key === "QualificationArea") {
                            value = getQualificationAreaTag(data[nameMap[key]]);
                            this.add(this.createSimpleNode(this.id + key, key + ": " + value, NodeType.ATTRIBUTE));
                        } else if (key === "ImpactArea") {
                            value = getImpactAreaTag(data[nameMap[key]]);
                            this.add(this.createSimpleNode(this.id + key, key + ": " + value, NodeType.ATTRIBUTE));
                        } else {
                            value = data[nameMap[key]];
                            this.add(this.createSimpleNode(this.id + key, key + ": " + value, NodeType.ATTRIBUTE));
                        }
                        this.attrs[key] = value;
                    }
                }
            } else { //arrange by fake node
                this.id = data['id'];
                this.parent = "#";
                this.text = data['text'];
            }
            this.type = type;

            function getQualificationAreaTag(categories) {
                var result = [];
                for (var i in categories) {
                    var value = categories[i];
                    if (value["QualificationArea"] === "1") {
                        result.push(value["CategoryName"]);
                    }
                }
                return result;
            }

            function getImpactAreaTag(categories) {
                var result = [];
                for (var i in categories) {
                    var value = categories[i];
                    if (value["QualificationArea"] !== "1") {
                        var path = value["CategoryPath"];
                        path = path.replace("Root\\", "");
                        path = path.replace("\\", " > ");
                        result.push(path + " > " + value["CategoryName"]);
                    }
                }
                return result;
            }
        }
        ;

        /*
         * Copy Node due to the fact that a test strategy node can be under multiple PRs
         */
        Node.prototype.copy = function (origin) {
            var newNode = new Node({
                id: origin.id,
                text: origin.text
            });
            newNode.children = origin.children;
            newNode.type = origin.type;
            newNode.attrs = origin.attrs;
            return newNode;
        };

        Node.prototype.add = function (child, nocopy) {
            if (nocopy) {
                var copy = child;
            } else {
                var copy = Node.prototype.copy(child);
                copy.id = this.id + copy.id;
            }
            this.children[child.id] = copy;
        };

        Node.prototype.createSimpleNode = function (key, text, type) {
            return new Node({
                id: key,
                text: text
            }, type);
        };

        Node.prototype.toTreeFormat = function (treeHash, parent) {
            treeHash[this.id] = {
                id: this.id,
                parent: parent ? parent.id : "#",
                text: this.text,
                icon: ""
            };
            //set icon based on type
            if (this.type === NodeType.TEST_STRATEGY) {
                treeHash[this.id].icon = iconPath + this.attrs['State'] + ".png";
                treeHash[this.id].popover = true;
            } else if (this.type === NodeType.ATTRIBUTE) {
                treeHash[this.id].icon = iconPath + "Attribute.png";
            }

            for (var prop in this.children) {
                if (this.children.hasOwnProperty(prop)) {
                    this.children[prop].toTreeFormat(treeHash, this);
                }
            }
        };

        testStrategyParser.groupTestStrategyBasedOnClassificationField = function (classificaitonField) {
            if (!classificaitonField)
                return testStrategyList;
            var nodeHash = {};
            for (var i = 0; i < testStrategyList.length; i++) {
                var key = testStrategyList[i].attrs[classificaitonField];
                if (!key)
                    key = "None";
                if (typeof key === 'object') { //process a list 
                    if (classificaitonField === "Requirements") {
                        for (var j in key) {
                            var prKey = key[j]['PRID'];
                            if (!(prKey in nodeHash)) {
                                nodeHash[prKey] = new Node({
                                    id: prKey,
                                    text: prKey
                                });
                            }
                            nodeHash[prKey].add(testStrategyList[i]);
                        }
                    } else {
                        for (var j in key) {
                            if (!(key[j] in nodeHash)) {
                                nodeHash[key[j]] = new Node({
                                    id: key[j],
                                    text: key[j]
                                });
                            }
                            nodeHash[key[j]].add(testStrategyList[i]);
                        }
                    }
                } else if (classificaitonField.indexOf("Date") !== -1) {
                    //pass datetime 2013-08-07 10:33:42.967 into Year and Date
                    var splits = key.split("-");
                    var year = splits[0];
                    var month = splits[1];
                    if (!(year in nodeHash)) {
                        nodeHash[year] = new Node({
                            id: year,
                            text: year
                        });
                    }
                    var monthAbbrevMap = ["None", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    if (!(month in nodeHash[year])) {
                        nodeHash[year][month] = new Node({
                            id: year + month,
                            text: monthAbbrevMap[Number(month)]
                        });
                        nodeHash[year].add(nodeHash[year][month], true);
                    }
                    nodeHash[year][month].add(testStrategyList[i]);
                } else {
                    if (!(key in nodeHash)) {
                        nodeHash[key] = new Node({
                            id: key,
                            text: key
                        });
                    }
                    nodeHash[key].add(testStrategyList[i]);
                }


            }
            var nodeList = [];
            for (var prop in nodeHash) {
                if (nodeHash.hasOwnProperty(prop)) {
                    nodeList.push(nodeHash[prop]);
                }
            }
            return nodeList;
        };
        //convert all the test strategies to tree format based on the classificationField (ex. Date, Qualificaiton Area, Impact Area, Approach etc.) passed in.
        testStrategyParser.toTreeFormat = function (classificaitonField) {
            var treeHash = [];
            var groupedNodeList = testStrategyParser.groupTestStrategyBasedOnClassificationField(classificaitonField);
            for (var index in groupedNodeList) {
                groupedNodeList[index].toTreeFormat(treeHash);
            }
            var treeArray = [];
            for (var prop in treeHash) {
                if (treeHash.hasOwnProperty(prop)) {
                    treeArray.push(treeHash[prop]);
                }
            }
            return treeArray;
        };

        //set the source of the test strategy data (A list of test strategy objects from the backend server)
        testStrategyParser.setSource = function (source, attributes) {
            attributeList = attributes;//a mapping of test strategy attribute name to the name needed to be showed on the UI
            for (var i = 0; i < source.length; i++) {
                testStrategyList.push(new Node(source[i], NodeType.TEST_STRATEGY));
            }
        };

        return testStrategyParser;
    }
    ;

    testStrategyService.$inject = ['$resource'];

    /**
     * Service for fetching information about testplan scopes
     */
    function testStrategyService($resource) {
        return $resource("/rest/strategies/:StrategyID?", {StrategyID: '@StrategyID', perpage: 'all'}, {
            get: {
                params: {details: true},
                transformResponse: appendApproach
            },
            query: {
                params: {fields: 'StrategyID,StrategyHeadline,State,Owner,ModifiedDate'},
                transformResponse: appendApproach,
                isArray: true
            },
            save: {
                method: 'PUT',
                transformResponse: appendApproach
            },
            patch: {
                method: 'PATCH',
                transformResponse: appendApproach,
            },
            'new': {
                method: 'POST',
                transformResponse: appendApproach
            },
            rev: {
                url: '/rest/strategies/:StrategyID/rev',
                method: 'POST'
            },
            vary: {
                url: '/rest/strategies/:StrategyID/vary',
                method: 'POST'
            },
            approve: {
                url: '/rest/strategies/:StrategyID/approve',
                method: 'POST'
            },
            promote: {
                url: '/rest/strategies/:StrategyID/promote',
                method: 'POST'
            },
            demote: {
                url: '/rest/strategies/:StrategyID/demote',
                method: 'POST'
            },
            obsolete: {
                url: '/rest/strategies/:StrategyID/obsolete',
                method: 'POST'
            }
        });

        /**
         * Fix the incoming data
         *
         * @param {string} data Incoming data from the service
         * @return {object|array} Parsed data
         */
        function appendApproach(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            if (Array.isArray(data)) {
                angular.forEach(data, function (val, key) {
                    val = fix(val);
                });
            } else {
                data = fix(data);
            }

            return data;

            /**
             * Add a new field to represent the approach ID
             *
             * @param {object} item Item to tweak
             * @return {object} Fixed item
             */
            function fix(item) {
                if (item && item.tags_test_approach && item.tags_test_approach.length > 0) {
                    item.approach = item.tags_test_approach[0].CategoryID;
                }

                return item;
            }
        }
    }

    testStrategyModalService.$inject = ['$rootScope', '$modal', '$q'];
    /**
     * Service provider for strategy editor as modal
     */
    function testStrategyModalService($rootScope, $modal, $q) {
        return function (id) {
            var modalScope = $rootScope.$new();

            if (id) {
                modalScope.id = id;
            }

            var modal = $modal({
                title: 'Test Strategy Editor',
                contentTemplate: 'angular/testStrategy/testStrategy.tpl.html',
                controller: 'Strategy',
                controllerAs: 'strategy',
                scope: modalScope
            });

            return modal;
        }
    }

})();
