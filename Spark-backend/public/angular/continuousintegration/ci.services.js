(function() {
    'use strict';

    angular
        .module('spark')
        .service('ContinuousIntegrationService', ContinuousIntegrationService);

    ContinuousIntegrationService.$inject = [ '$q','$http'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function ContinuousIntegrationService ($q,$http) {

        var vm = this;
        vm.btns = [
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

        vm.views = {
             PRODUCTNAME: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_qual_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Product Name'
             },
             PLATFORM: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_impact_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Platform'
             },
             BUILDNUMBER: {
                 value: null,
                 text: 'build number'
             },
             BUILDDATE: {
                 value: null,
                 text: 'build date'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        vm.getContinuousIntegrationData = function(){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
                  return  $q.all({
                   products:$http({
	                    method: 'GET',
		                    // Disable the end point for now and use json file instead
		                    //url: '/rest/ci/products'
		                    url: '/json/get-rest.ci.products.json'
	                    })
                    });


        };

        vm.getTreeJson = function(arg){

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

           var productsData = arg.products.data.data;

           for (var i=0; i < productsData.length; i++)
           {
               var rootNode = new nodeJson(productsData[i].id, productsData[i].Headline, productsData[i].icon);
               treeJson.push(rootNode);
           }

           return treeJson;

        }

    }

})();
