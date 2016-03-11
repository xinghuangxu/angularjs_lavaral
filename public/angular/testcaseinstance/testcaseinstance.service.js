(function() {
    'use strict';

    angular
        .module('spark')
        .service('TestCaseInstanceService', TestCaseInstanceService);

    TestCaseInstanceService.$inject = [ '$q','$http'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function TestCaseInstanceService ($q,$http) {

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


        this.getServiceData = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any

                  return  $q.all({
                   folders:$http({
                    method: 'GET',
                    url: '/rest/alm/databases/apg_qa_producttest_db/folder/'+ id,
//                    url: 'json/rest.alm.databases.apg_qa_producttest_db.folder.510.json'
                    }),
                   TestSet:$http({
                    method: 'GET',
//                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testsets.532.json'
                    url: '/rest/alm/databases/apg_qa_producttest_db/testsets/' + id,
                    params: { id: '@id'},
                    }),
                    TestCaseInstance:$http({
                    method: 'GET',
//                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testcaseinstances.51097.json'
                    url: '/rest/alm/databases/apg_qa_producttest_db/testcaseinstances/' + id,
                    params: { id: '@id'},
                    })
                    });


        };

        this.getTreeJson = function(){

        };

        this.getTreeJson = function(arg){

           var treeJson =[]
           var nodeJson =function(id,text,icon){
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
            }

           var foldersData = arg.folders.data;
           var TestSetData = arg.TestSet.data;
           var TestCaseInstanceData = arg.TestCaseInstance.data;


           for (var i=0; i<foldersData.length;i++)
           {
               var rootNode = new nodeJson(foldersData[i].id,foldersData[i].text,foldersData[i].icon);

            for(var j =0; j<TestSetData.length; j++)
            {
             var secondLevelChildNode = new nodeJson(TestSetData[j].id,TestSetData[j].title,TestSetData[j].icon);
             for (var tsi=0; tsi < TestCaseInstanceData.length; tsi++){
                 var ThirdLevelChildren = new nodeJson(TestCaseInstanceData[tsi].id,TestCaseInstanceData[tsi].test_case_name,TestCaseInstanceData[tsi].icon);
                 secondLevelChildNode.children.push(ThirdLevelChildren);
             }
               rootNode.children.push(secondLevelChildNode);
            }

            treeJson.push(rootNode);
           }

           return treeJson;


        }


    }


})();