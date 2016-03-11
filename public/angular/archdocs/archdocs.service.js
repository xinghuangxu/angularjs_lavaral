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
             DOCUMENTTYPE: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_qual_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Document type'
             },
             MODIFICATIONDATE: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_impact_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Modification Date'
             },
             KEYWORD: {
                 value: null,
                 text: 'Keyword'
             },
             AUTHOR: {
                 value: null,
                 text: 'Author'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        this.getDocsAndTopicsData = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
                  id = id || ""  ;
                  return  $q.all({
                   documents:$http({
                    method: 'GET',
                    url: '/rest/v2/requirements/archdocs/?&perpage=all'
//                    url: 'json/get-rest.requirements.archdocs.json'
                    }),
                   topics:$http({
                    method: 'GET',
                    url: '/rest/v2/requirements/archdocs/'+ id + '/topics',
//                    url: 'json/get-rest.requirements.archdocsnew.1.topics.json'
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
               var rootNode = new nodeJson(documentsData[i].ID,documentsData[i].DocDescription,documentsData[i].icon);
               var firstLevelChild = new nodeJson(documentsData[i].DocumentID,documentsData[i].DocTitle,documentsData[i].icon);
               rootNode.children.push(firstLevelChild);

            for(var j =0; j<topicsData.length; j++)
            {
             var secondLevelChildNode = new nodeJson(topicsData[j].topic_id,topicsData[j].topic_name,topicsData[j].icon);

               rootNode.children[0].children.push(secondLevelChildNode);
            }

            treeJson.push(rootNode);
           }

           return treeJson;


        }


    }


})();