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




        this.getDocsAndTopicsData = function(){


                  return  $q.all({
                   folders:$http({
                    method: 'GET',
                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testcasefolders.16548.json'
                    }),
                   Service:$http({
                    method: 'GET',
                    url: 'json/rest.alm.databases.apg_qa_producttest_db.testcasesbyfolder.16546.json'
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