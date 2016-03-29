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
                  id = id || "";
                  return  $q.all({
                   documents:$http({
                        method: 'GET',
                            url: '/rest/v2/requirements/archdocs/?&perpage=all'
                        }),
                   topics:$http({
                        method: 'GET',
                            url: '/rest/v2/requirements/archdocs/'+ id + '/topics',
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
           var topicsData = arg.topics.data;

           for (var i=0; i < documentsData.length; i++)
           {
               var rootNode = new nodeJson(documentsData[i].id, documentsData[i].doc_title, documentsData[i].icon);
               treeJson.push(rootNode);

               // lazy load should be implemented here

               for(var j =0; j < topicsData.length; j++)
               {
                 var secondLevelChildNode = new nodeJson(topicsData[j].id, topicsData[j].topic_name, topicsData[j].icon);

                 rootNode.children.push(secondLevelChildNode);
               }

           }

           return treeJson;


        }


    }


})();