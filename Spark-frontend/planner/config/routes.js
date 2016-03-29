/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function () {
    'use strict';

    angular.module('planner').config(routesConfig);
    routesConfig.$inject = [
        "$stateProvider",
        "$urlRouterProvider",
        "pluginNamesConstant"
    ];
    function routesConfig($stateProvider,$urlRouterProvider,pluginNamesConstant) {

        $stateProvider
            .state('base_template', {
                abstract:true,
                templateUrl: "planner/planner.html",
                controller: "plannerController as plannerController"
            }).state('base_template.partials', {
            abstract:true,
            views: {
                header: {
                    templateUrl: "planner/partials/header/_header.html"
                },
                right_side_bar: {
                    templateUrl: "planner/partials/right_side_bar/_right_side_bar.html"
                },
                content_wrapper: {
                    templateUrl: "planner/partials/content_wrapper/_content_wrapper.html"
                },
                left_side_bar: {

                    templateUrl: "planner/partials/left_side_bar/_left_side_bar.html",
                    controller:"leftSideBarController as leftSideBarController"
                },
                footer: {
                    templateUrl: "planner/partials/footer/_footer.html"
                }


            }
        }).state('base_template.partials.planner', {
            url: "/planner?plugin_1&plugin_2&plugin_3",
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


                }
            },
            views:{
                "plugin_wrapper@base_template.partials":{
                    templateProvider:function(activePluginsValue){
                        var template="";
                        var number_of_params=activePluginsValue.length;
                        var column_class = 'col-md-'+12/number_of_params;
                        for(var index =1;index<=number_of_params;index++)
                        {
                            template+="<div class='"+column_class+"' ui-view='plugin_"+index+"'></div>"

                        }
                        return "<div class='row'> " +template+"</div>";
                    }
                },

                "plugin_1@base_template.partials.planner":{
                    templateUrl:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_1']]&&
                            pluginNamesConstant[$stateParams['plugin_1']].templateUrl;
                    },
                    controllerProvider:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_1']]&&
                            pluginNamesConstant[$stateParams['plugin_1']].controller;
                    }
                },
                "plugin_2@base_template.partials.planner":{
                    templateUrl:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_2']]&&
                            pluginNamesConstant[$stateParams['plugin_2']].templateUrl;
                    },
                    controllerProvider:function($stateParams){
                        return pluginNamesConstant[$stateParams['plugin_2']]&&
                            pluginNamesConstant[$stateParams['plugin_2']].controller;
                    }
                },
                "plugin_3@base_template.partials.planner":{
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

        $urlRouterProvider.otherwise('/planner?plugin_1=rally&plugin_2=sow&plugin_3=boxcar');

    }





})();
