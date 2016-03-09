(function() {
    'use strict';

    angular
        .module('spark')
        .service('TestCaseService', TestCaseService);

    TestCaseService.$inject = [ '$q','$http'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function TestCaseService ($q,$http) {

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


        this.getFoldersAndServiceData = function(){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any

                  return  $q.all({
                   folders:$http({
                    method: 'GET',
//                    url: '/rest/alm/databases/apg_qa_producttest_db/testcasefolders/:id'
//                    params: { id: '@id'},
                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testcasefolders.16548.json'
                    }),
                   Service:$http({
                    method: 'GET',
                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testcasesbyfolder.16546.json'
//                    url: '/rest/alm/databases/apg_qa_producttest_db/testcasesbyfolder/:id'
//                    params: { id: '@id'},
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
           var ServiceData = arg.Service.data;


           for (var i=0; i<foldersData.length;i++)
           {
               var rootNode = new nodeJson(foldersData[i].id,foldersData[i].text,"glyphicon glyphicon-folder-open");

            for(var j =0; j<ServiceData.length; j++)
            {
             var secondLevelChildNode = new nodeJson(ServiceData[j].id,ServiceData[j].test_case_name,"glyphicon glyphicon-list-alt");

               rootNode.children.push(secondLevelChildNode);
            }

            treeJson.push(rootNode);
           }

           return treeJson;


        }


    }


})();