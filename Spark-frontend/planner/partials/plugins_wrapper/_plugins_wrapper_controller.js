/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('planner').controller('pluginsWrapperController',pluginsWrapperController);

    pluginsWrapperController.$inject= ['$stateParams','activePluginsValue'];
    function pluginsWrapperController($stateParams,activePluginsValue){

        var pluginsWrapperController = this;
        pluginsWrapperController.active_Plugins = activePluginsValue;

    }



})();
