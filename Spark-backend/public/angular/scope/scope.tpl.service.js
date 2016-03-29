(function() {
    'use strict';

    angular
        .module('spark.scope')
        .service('scopeTplService', scopeTplService);
    scopeTplService.inject=['$q','$http'];
    function scopeTplService($q,$http) {

            var fetchData = function(){
                return $http.get('json/data.json').then(function(resp){
                return resp;
                })
                }

            this.getTabs = function(tab_id){
                if(!tab_id)
                    {
                    return false;
                    }
                return fetchData().then(function(resp){
                 var tabs = resp.data.default_tabs;
                 tabs[tab_id-1].active = true;
                   return tabs;
                })




            };
            this.getTabContent = function(tab_id,sub_tab_id){
                 if(!tab_id)
                    {
                    return false;
                    }

                 return fetchData().then(function(resp){

                 var content = resp.data.tab_content;
                        content[tab_id-1].sub_tabs ?
                        content[tab_id-1].sub_tabs[sub_tab_id-1].active = true : ""

                        return content[tab_id-1];

                })



            };
            this.getSubTabContent = function(tab_id,sub_tab_id){
               if(!sub_tab_id || !tab_id)
                    {
                    return false;
                    }
                    return fetchData().then(function(resp){

                    var content=resp.data.tab_content[tab_id-1].sub_tabs?
                    resp.data.tab_content[tab_id-1].sub_tabs[sub_tab_id-1].content:false;

                     return content;

                })



            };





    };
})();
