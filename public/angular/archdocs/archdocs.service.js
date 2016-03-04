(function() {
    'use strict';

    angular
        .module('spark')
        .service('archdocsService', archdocsService);

    archdocsService.$inject = [ '$q','$http'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function archdocsService ($q,$http) {




        this.getDocsAndTopicsData = function(){


                  return  $q.all({
                   documents:$http({
                    method: 'GET',
                    url: 'json/get-rest.requirements.archdocs.json'
                    }),
                   topics:$http({
                    method: 'GET',
                    url: 'json/get-rest.requirements.archdocsnew.1.topics.json'
                    })
                    });


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

           var documentsData = arg.documents.data;
           var topicsData = arg.topics.data.data;


           for (var i=0; i<documentsData.length;i++)
           {
               var rootNode = new nodeJson(documentsData[i].ID,documentsData[i].DocDescription,"glyphicon glyphicon-folder-open");
               var firstLevelChild = new nodeJson(documentsData[i].DocumentID,documentsData[i].DocTitle,"glyphicon glyphicon-book");
               rootNode.children.push(firstLevelChild);

            for(var j =0; j<topicsData.length; j++)
            {
             var secondLevelChildNode = new nodeJson(topicsData[j].topic_id,topicsData[j].topic_name,"glyphicon glyphicon-list-alt");

               rootNode.children[0].children.push(secondLevelChildNode);
            }

            treeJson.push(rootNode);
           }

           console.log(treeJson);

           return treeJson;


        }


    }


})();