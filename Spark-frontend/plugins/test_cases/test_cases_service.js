/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testCases')
        .service('testCasesService',testCasesService);

    // We should enable the following line once settings module is available
    // testCasesService.$inject= [ '$q','$http', 'testplanSettingsService'];
    testCasesService.$inject= ['$http', 'pluginNamesConstant'];

    // we should enable the following function signature once settings module is available
    //function testCasesService($q,$http, planSettings){

    function testCasesService($http, pluginNamesConstant){

        this.getTestCasesRepositories = getTestCasesRepositories;
        this.getFolders = getFolders;
        this.getTestCases= getTestCases;
        this.getTestCasesRepositoriesTree = getTestCasesRepositoriesTree;
        this.getTreeJson= getTreeJson;
        this.getTreeCaseTreeJson = getTestCaseTreeJson;
        this.getArrangeBy = getArrangeBy;

        // Start of Implementation

        function getTestCasesRepositories(){
            var ServerName = (location.host === 'localhost:8080') ? 'http://localhost:8000' :'';
            return $http({
                method: 'GET',
                // should be activated after settings
                //url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/testcasefolders/'
                url: ServerName + '/rest/testrepositories'
            });
        }

        function getFolders(id){
            var ServerName = (location.host === 'localhost:8080') ? 'http://localhost:8000' :'';
            return $http({
                method: 'GET',
                // should be activated after settings
                //url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/testcasefolders/'
                url:  ServerName + '/rest/alm/databases/database/testcasefolders/'
            });
        }

        function getTestCases(id){
            var ServerName = (location.host === 'localhost:8080') ? 'http://localhost:8000' :'';
            return $http({
                method: 'GET',
                // should be activated after settings
                // url: '/rest/alm/databases/'+ planSettings.data.alm_db_name + '/testcasesbyfolder/' + id
                url: ServerName + '/rest/alm/databases/database/testcasefolders/' + id
            });
        }
        
        function getTestCasesRepositoriesTree(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.data = 'testCaseRepo',
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= true,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);

                treeJson.push(node);
            }
            return treeJson;
        }

        function getTreeJson(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= true,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].text,treeData[i].icon);
                treeJson.push(node);
            }
            return treeJson;
        }

        function getTestCaseTreeJson(data){
            var nodeJson = function(id, text, icon, children){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= children,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                if (treeData[i].hasChildren){
                    var node = new nodeJson(treeData[i].id,treeData[i].test_case_name,treeData[i].icon, true);
                }
                else{
                    var node = new nodeJson(treeData[i].id,treeData[i].test_case_name,treeData[i].icon);
                }
                treeJson.push(node);
            }
            return treeJson;
        }

        function getArrangeBy(){
            return {
                TESTER: {
                    // the following lines have been commented because we are going to use them later
//                 value: 'tags_qual_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                    text: 'Document type'
                },
                EXECUTIONDATE: {
                    // the following lines have been commented because we are going to use them later
//                 value: 'tags_impact_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                    text: 'Execution date'
                },
                RUNSTATUS: {
                    value: null,
                    text: 'Run Status'
                },
                NONE: {
                    value: null,
                    text: 'None'
                }
            };
        }

    }
})();
