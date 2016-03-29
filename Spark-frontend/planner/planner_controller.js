/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
     angular.module('planner').controller('plannerController',plannerController);

    plannerController.$inject= ['activePluginsValue'];
    function plannerController(activePluginsValue){

        var plannerController =this;
        plannerController.active_plugins = activePluginsValue;
        console.log('planner');
        
       


    }



})();
