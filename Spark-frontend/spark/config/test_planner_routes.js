/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function () {
    'use strict';

    angular.module('spark').config(testPlannerRouteConfig);
    testPlannerRouteConfig.$inject = [
        "$stateProvider",
        "$urlRouterProvider",
        "pluginNamesConstant"
    ];
    function testPlannerRouteConfig($stateProvider,$urlRouterProvider,pluginNamesConstant) {

        $stateProvider
            .state('test_planner_base_template', {
                abstract:true,
                templateUrl: "test_planner/test_planner.html",
                resolve:{
                    releases:function(testPlannerServices){
                        return 1;
                    }
                },
                controller: "testPlannerController as testPlannerController"
            }).state('test_planner_base_template.test_planner_partials', {
            abstract:true,
            views: {
                header: {
                    templateUrl: "test_planner/partials/header/header.html"
                },
                right_side_bar: {
                    templateUrl: "test_planner/partials/right_side_bar/right_side_bar.html"
                },
                content_wrapper: {
                    templateUrl: "test_planner/partials/content_wrapper/content_wrapper.html",
                    controller: "testPlannerController as testPlannerController"
                },
                left_side_bar: {

                    templateUrl: "test_planner/partials/left_side_bar/left_side_bar.html",
                    controller:"leftSideBarController as leftSideBarController"
                },
                footer: {
                    templateUrl: "test_planner/partials/footer/footer.html"
                }


            }
        }).state('test_planner_base_template.test_planner_partials.test_planner', {
            url: "/test_planner?plugin_1&plugin_2&plugin_3&release_id&stack_id&substack_id",
            resolve:{
                setting_active_plugins:function($stateParams,activePluginsValue){
                    var params = $stateParams;

                    for(var i=1;i<=3;i++)
                    {
                        if(pluginNamesConstant[params['plugin_'+i]])
                        {
                            activePluginsValue[i-1]=params['plugin_'+i];
                        }
                        else if(activePluginsValue[i-1])
                        {
                            activePluginsValue.splice(i-1,1);
                        }

                    }


                },
                setting_plugin_config_value:function($stateParams,pluginsConfigValue){
                    pluginsConfigValue.release_id= $stateParams.release_id;
                    pluginsConfigValue.stack_id= $stateParams.stack_id;
                    pluginsConfigValue.substack_id= $stateParams.substack_id;
                }
            },
            views:{
                "plugin_wrapper@test_planner_base_template.test_planner_partials":{
                    templateProvider:function(activePluginsValue){
                        var template="";
                        var number_of_params=activePluginsValue.length;
                        var column_class = 'col-md-'+12/number_of_params;
                        for(var index =1;index<=number_of_params;index++)
                        {
                            template+="<div class='pad-l-r-6 "+column_class+"' ui-view='plugin_"+index+"'></div>"

                        }
                        return "<div class='row'> " +template+"</div>";
                    }
                },

                "plugin_1@test_planner_base_template.test_planner_partials.test_planner":{
                    templateUrl:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_1']]&&
                            pluginNamesConstant[$stateParams['plugin_1']].templateUrl;
                    },
                    controllerProvider:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_1']]&&
                            pluginNamesConstant[$stateParams['plugin_1']].controller;
                    }
                },
                "plugin_2@test_planner_base_template.test_planner_partials.test_planner":{
                    templateUrl:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_2']]&&
                            pluginNamesConstant[$stateParams['plugin_2']].templateUrl;
                    },
                    controllerProvider:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_2']]&&
                            pluginNamesConstant[$stateParams['plugin_2']].controller;
                    }
                },
                "plugin_3@test_planner_base_template.test_planner_partials.test_planner":{
                    templateUrl:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_3']]&&
                            pluginNamesConstant[$stateParams['plugin_3']].templateUrl;
                    },
                    controllerProvider:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_3']]&&
                            pluginNamesConstant[$stateParams['plugin_3']].controller;
                    }
                }
            }

        });


        /* Add New Routes Above */

        $urlRouterProvider.otherwise('/test_planner?plugin_1=rally&plugin_2=sow&plugin_3=boxcar');

    }





})();
