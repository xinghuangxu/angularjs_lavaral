(function() {
    'use strict';

    angular
        .module('spark')
        .service('ImplementationRequestsService', ImplementationRequestsService);

    ImplementationRequestsService.$inject = [ '$q','$http'];

    /**
     * Service wrapper around test strategies for the test planner
     */
    function ImplementationRequestsService ($q,$http) {

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

        vm.getImplementationRequestsData = function(id){
            // in production you should comment the lines that has "json"
            // and use only the ones the has rest and uncomment params line too if any
                  return  $q.all({
                   implrequests:$http({
                    method: 'GET',
                    // Disbale the end point for now and use json file instead 
//                    url: '/rest/cq/boxcars/' + id + '/implrequests/'
                    url: '/json/rest.cq.implrequests.json'
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

           var implrequestsData = arg.implrequests.data.data;

           for (var i=0; i<implrequestsData.length;i++)
           {
               var rootNode = new nodeJson(implrequestsData[i].id,implrequestsData[i].Headline,implrequestsData[i].icon);
               treeJson.push(rootNode);
           }

           return treeJson;

        }

    }

})();
