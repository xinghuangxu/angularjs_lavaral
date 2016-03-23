(function() {
    'use strict';

    angular
        .module('spark')
        .service('TestCaseInstanceService', TestCaseInstanceService);

    TestCaseInstanceService.$inject = [ '$q','$http', 'testplanSettingsService'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function TestCaseInstanceService ($q,$http, planSettings) {

        this.btns = [
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

        this.views = {
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
        }
        
        this.getFolders = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
            return $http({
                method: 'GET',
                //url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/folder/'+ id
                url: 'json/get-rest.alm.databases.apg_qa_producttest_db.folder.510.json'
            });
        };
        
        this.getTestSet = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
            return $http({
                method: 'GET',
                //url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/testsets/' + id
                url: 'json/get-rest.alm.databases.apg_qa_producttest_db.testsets.532.json'
            });
        };
        
        this.getTestCaseInstance = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
            return $http({
                method: 'GET',
                //url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/testcaseinstances/' + id
                url: 'json/get-rest.alm.databases.apg_qa_producttest_db.testcaseinstances.51097.json'
            });
        };

        this.getTreeJson = function(data){
            
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
                    var node = new nodeJson(treeData[i].id,treeData[i].text,treeData[i].icon, true);
                }
                else{
                    var node = new nodeJson(treeData[i].id,treeData[i].text,treeData[i].icon);
                }
                treeJson.push(node);
            }
            console.log(treeJson)
            return treeJson;
        };
        
        this.getTestSetTreeJson = function(data){
            
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
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);
                treeJson.push(node);
            }
            console.log(treeJson)
            return treeJson;
        };
        
        this.getTestCasesInstanceTreeJson = function(data){
            
            var nodeJson = function(id, text, icon, children){
                this.id= id,
                this.text=text,
                this.icon= icon||null,
                this.state= {
                    "opened": false,
                    "disabled": false,
                    "selected": false
                },
                this.children= [],
                this.liAttributes= null,
                this.aAttributes= null
            };
            
            var treeJson = []; 
            var treeData = data.data; 
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].test_case_name,treeData[i].icon);
                treeJson.push(node);
            }
            console.log(treeJson)
            return treeJson;
        };

    }


})();