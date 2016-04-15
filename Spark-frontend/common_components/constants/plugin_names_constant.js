/**
 * Created by e897x724 on 3/21/2016.
 */
(function () {
    'use strict';

    angular.module('commonComponents').constant('pluginNamesConstant', {

        "test_cases": {
            templateUrl: 'plugins/test_cases/test_cases.html',
            controller: 'testCasesController as TCCtrl',

        },
        "test_plan": {
            templateUrl: 'plugins/test_plan/test_plan.html',
            controller: 'testPlanController as TPCtrl'
        },
        "test_strategy":{
            templateUrl: 'plugins/test_strategy/test_strategy.html',
            controller: 'testStrategyController as TSCtrl'
        },
        "test_runs": {
            templateUrl: 'plugins/test_runs/test_runs.html',
            controller: 'testRunsController as TRCtrl'

        },
        "reference_documents": {
            templateUrl: 'plugins/reference_documents/reference_documents.html',
            controller: 'referenceDocumentsController as RDCtrl',

        },
        "scoping_info": {
            templateUrl: 'plugins/scoping_info/scoping_info.html',
            controller: 'scopingInfoController as SICtrl'

        }
    });


})();