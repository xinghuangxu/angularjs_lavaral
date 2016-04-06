(function(){
    'use strict';
    
    angular
        .module('referenceDocuments')
        .service('referenceDocumentsService',referenceDocumentsService);


    referenceDocumentsService.$inject=['$http', 'pluginNamesConstant'];

    function referenceDocumentsService($http, pluginNamesConstant){

        this.getReferenceDocs = getReferenceDocs;
        this.getTopicsData = getTopicsData;
        this.getReferenceDocsTree = getReferenceDocsTree;
        this.getTopicsDataTree = getTopicsDataTree;
        this.getArrangeBy = getArrangeBy;


        function getReferenceDocs(){
            return $http({
                method: 'GET',
                // should be activated after settings
                //url: '/rest/v2/requirements/archdocs/?&perpage=all'
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/v2/requirements/archdocs/?&perpage=all'
            });
        }

        function getTopicsData(id){
            return $http({
                method: 'GET',
                // should be activated after settings
                // url: '/rest/v2/requirements/archdocs/'+ id + '/topics'
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/v2/requirements/archdocs/'+ id + '/topics'
            });
        }

        function getReferenceDocsTree(data){
            var nodeJson = function(id, text, icon){
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
            var treeData = data.data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].doc_type,"glyphicon glyphicon-folder-open");
                var firstChildNode = new nodeJson(treeData[i].doc_id,treeData[i].doc_title,treeData[i].icon);

                node.children.push(firstChildNode);
                node.children[0].children = true;

                treeJson.push(node);
            }
            return treeJson;
        }

        function getTopicsDataTree(data){
            var nodeJson = function(id, text, icon){
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
            var treeData = data.data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].topic_id,treeData[i].topic_name,treeData[i].icon);
                treeJson.push(node);
            }
            return treeJson;
        }

        function getArrangeBy(){
            return {
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
            };
        }
    }
})();
