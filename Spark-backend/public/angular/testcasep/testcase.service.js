(function() {
    'use strict';

    angular
        .module('spark')
        .service('TestCaseService', TestCaseService);

    TestCaseService.$inject = [ '$q','$http', 'testplanSettingsService'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function TestCaseService ($q,$http, planSettings) {

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

        this.getFolders = function(){
            return $http({
                method: 'GET',
                // Maneesh, to vaildate that the index method is forced to be zero so no need to add it here
                url: '/rest/alm/databases/'+ planSettings.data.alm_db_name +'/testcasefolders/'
            });
        };

        this.getTestCases = function(id){
            return $http({
                method: 'GET',
                url: '/rest/alm/databases/'+ id + '/testcasesbyfolder/' + id
            });
        };

        this.getTreeJson = function(data){

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
        };

        this.getTestCaseTreeJson = function(data){
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
        };


    }


})();