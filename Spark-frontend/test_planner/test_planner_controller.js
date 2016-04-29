/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
     angular.module('testPlanner').controller('testPlannerController',testPlannerController);

    testPlannerController.$inject= [
        'activePluginsValue',
        'pluginsConfigValue',
        'testPlannerServices',
        '$state',
        '$stateParams',
        'releases'
    ];
    function testPlannerController(activePluginsValue,
                                   pluginsConfigValue,
                                   testPlannerServices,
                                   $state,
                                   $stateParams,
                                   releases){

        var testPlannerController = this;
        testPlannerController.active_plugins = activePluginsValue;
        testPlannerController.getStackLayers = getStackLayers;
        testPlannerController.getSubLayers = getSubLayers;
        testPlannerController.reloadCurrentState =reloadCurrentState;
        testPlannerController.release_id=pluginsConfigValue.release_id;
        testPlannerController.stack_id=pluginsConfigValue.stack_id;
        testPlannerController.substack_id=pluginsConfigValue.substack_id;

        testPlannerController.releases=releases.data;

        if (testPlannerController.release_id){
            getStackLayers();
            if (testPlannerController.stack_id)
                getSubLayers();
        }

        function getStackLayers(){
            testPlannerServices.getStackLayer(testPlannerController.release_id).then(function(response){
                testPlannerController.stack_layers = response.data;
            });
        }

        function getSubLayers(){
            testPlannerServices.getSubStackLayer(testPlannerController.stack_id).then(function(response){
                testPlannerController.sub_layers = response.data;
            });
        }

        function reloadCurrentState(){
            $state.go($state.current, {
                release_id:testPlannerController.release_id,
                stack_id:testPlannerController.stack_id,
                substack_id:testPlannerController.substack_id
            }, {reload: false});
        }

    }



})();
