(function () {
    'use strict';
    angular.module('testPlanner').controller('leftSideBarController', leftSideBarController);
    leftSideBarController.$inject = ['$state', 'activePluginsValue'];
    function leftSideBarController($state, activePluginsValue) {

        var leftSideBarController = this;
        leftSideBarController.togglePlugin = togglePlugin;


        function togglePlugin(plugin_name) {
            if(activePluginsValue.indexOf(plugin_name)>-1)
            {
                activePluginsValue.splice(activePluginsValue.indexOf(plugin_name),1);
            }
            else{
                var empty_plugin_index=checkWhichPluginIsEmpty(activePluginsValue);
                 activePluginsValue[empty_plugin_index]=plugin_name;

            }
            $state.transitionTo($state.current.name, createParams(activePluginsValue));


        }

        function createParams(active_plugins) {
            var params = {};
            active_plugins[0] &&
            (params['plugin_1'] = active_plugins[0]);
            active_plugins[1] &&
            (params['plugin_2'] = active_plugins[1]);
            active_plugins[2] &&
            (params['plugin_3'] = active_plugins[2]);

            return params;

        }
        function checkWhichPluginIsEmpty(plugins){
            for(var i=0;i<3;i++ )
            {
                if(!plugins[i])
                    return i;
            }
            return false;
        }


    }


})();




