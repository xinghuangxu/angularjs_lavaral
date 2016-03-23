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

        vm.getDevRequests = function(id){
            return $http({
                method: 'GET',
                //url: '/rest/cq/boxcars/'+ id +'/devrequests/'
                url: '/json/get-rest.cq.boxcars.LSIP200XXXXXX.devrequests.json'
            });
        };

        vm.getImplRequests = function(id){
            return $http({
                method: 'GET',
                //url: '/rest/cq/boxcars/'+ id +'/devrequests/'
                url: '/json/get-rest.cq.devrequests.LSIP200XXXXXX.implrequests.json'
            });
        };

        vm.getTasks = function(){
            return $http({
                method: 'GET',
                //url: '/rest/cq/tasks'
                url: '/json/get-rest.cq.tasks.json'
            });
        };

        vm.getDevRequestTree = function(arg){
            var nodeJson =function(id,text,icon){
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
                this.aAttributes= null,
                this.data = 'DevRequest'
            }
            var treeJson =[]

            var devrequestsData = arg.data.data;

            for (var i=0; i < devrequestsData.length; i++)
            {
                var rootNode = new nodeJson(devrequestsData[i].id, devrequestsData[i].Headline, devrequestsData[i].icon);
                treeJson.push(rootNode);
            }

            return treeJson;
        };

        vm.getImplRequestTree = function(arg){
            var nodeJson =function(id,text,icon){
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
                this.aAttributes= null,
                this.data = 'ImplementationRequest'
            }
            var treeJson =[];

            var implrequestsData = arg.data.data;

            for (var i=0; i < implrequestsData.length; i++)
            {
                var rootNode = new nodeJson(implrequestsData[i].id, implrequestsData[i].Headline, implrequestsData[i].icon);
                treeJson.push(rootNode);
            }

            return treeJson;
        };

        vm.getTaskTree = function(arg){
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
            var treeJson =[];

            var tasksData = arg.data.data;

            for (var i=0; i < tasksData.length; i++)
            {
                var rootNode = new nodeJson(tasksData[i].id, tasksData[i].Headline, tasksData[i].icon);
                treeJson.push(rootNode);
            }

            return treeJson;
        };

    }

})();
