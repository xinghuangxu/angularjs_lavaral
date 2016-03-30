/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
     angular.module('testPlanner').controller('testPlannerController',testPlannerController);

    testPlannerController.$inject= ['activePluginsValue'];
    function testPlannerController(activePluginsValue){

        var testPlannerController =this;
        testPlannerController.active_plugins = activePluginsValue;
        console.log('test planner');
        
       


    }



})();
