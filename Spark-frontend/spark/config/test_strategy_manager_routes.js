/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function () {
    'use strict';

    angular.module('spark').config(testStrategyRouteConfig);
    testStrategyRouteConfig.$inject = [
        "$stateProvider",
        "$urlRouterProvider",
        "pluginNamesConstant"
    ];
    function testStrategyRouteConfig($stateProvider, $urlRouterProvider, pluginNamesConstant) {

        $stateProvider
            .state('tsm_base_template', {
                abstract: true,
                templateUrl: "test_strategy_manager/test_strategy_manager.html",
                controller: "testStrategyManagerController as TSMCtrl"
            }).state('tsm_base_template' +
            '.tsm_partials', {
            abstract: true,
            views: {
                header: {
                    templateUrl: "test_strategy_manager/partials/header/header.html"
                },
                left_side_bar: {
                    templateUrl: "test_strategy_manager/partials/left_side_bar/left_side_bar.html"
                },
                right_side_bar: {
                    templateUrl: "test_strategy_manager/partials/right_side_bar/right_side_bar.html"
                },
                content_wrapper: {
                    templateUrl: "test_strategy_manager/partials/content_wrapper/content_wrapper.html"
                }
            }
        }).state('tsm_base_template.' +
            'tsm_partials.' +
            'tsm', {
            abstract: true,
            resolve:{
                dropdown_values:function($q,strategyEditorServices){
                    return $q.all([
                        strategyEditorServices.getImpactArea(),
                        strategyEditorServices.getQualifications(),
                        strategyEditorServices.getApproach()
                    ]);
                }
            },
            views: {
                strategy_viewer: {
                    templateUrl: "test_strategy_manager/panels/viewer/viewer.html",
                    controller: "strategyViewerController as TSSVCtrl"
                },
                strategy_editor: {
                    templateUrl: "test_strategy_manager/panels/editor/editor.html",
                    controller: "strategyEditorController as strategyEditorCtlr"
                }

            }


        }).state('tsm_base_template.' +
            'tsm_partials.' +
            'tsm.' +
            'test_strategy', {
            url: "/test_strategy_manager/test_strategy/",
            views: {
                'plugin@tsm_base_template.tsm_partials': {
                    templateUrl: pluginNamesConstant['test_strategy'].templateUrl,
                    controller: pluginNamesConstant['test_strategy'].controller

                }

            }


        }).state('tsm_base_template.' +
            'tsm_partials.' +
            'tsm.' +
            'reference_documents', {
            url: "/test_strategy_manager/reference_documents/",
            views: {
                'plugin@tsm_base_template.tsm_partials': {
                    templateUrl: pluginNamesConstant['reference_documents'].templateUrl,
                    controller: pluginNamesConstant['reference_documents'].controller

                }

            }


        }).state('tsm_base_template.' +
            'tsm_partials.' +
            'tsm.' +
            'test_cases', {
            url: "/test_strategy_manager/test_cases/",
            views: {
                'plugin@tsm_base_template.tsm_partials': {
                    templateUrl: pluginNamesConstant['test_cases'].templateUrl,
                    controller: pluginNamesConstant['test_cases'].controller

                }

            }


        });


    }


})();
