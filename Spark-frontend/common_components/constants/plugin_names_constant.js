/**
 * Created by e897x724 on 3/21/2016.
 */
(function () {
    'use strict';

    angular.module('commonComponents').constant('pluginNamesConstant', {

        "reference_documents": {
            templateUrl: 'plugins/reference_documents/reference_documents.html',
            controller: 'referenceDocumentsController as RDCtrl',

        },
        "boxcar": {
            templateUrl: 'plugins/boxcar/boxcar.html',
            controller: 'boxcarController as BCCtrl'

        },
        "configuration_plan": {
            templateUrl: 'plugins/configuration_plan/configuration_plan.html',
            controller: 'configurationPlanController as CPCtrl'

        },
        "high_level_scope": {
            templateUrl: 'plugins/high_level_scope/high_level_scope.html',
            controller: 'highLevelScopeController as HLSCtrl'

        },
        "implementation_requests": {
            templateUrl: 'plugins/implementation_requests/implementation_requests.html',
            controller: 'implementationRequestsController as IRCtrl'


        },
        "rally": {
            templateUrl: 'plugins/rally/rally.html',
            controller: 'rallyController as RCtrl'

        },
        "rcca": {
            templateUrl: 'plugins/rcca/rcca.html',
            controller: 'rccaController as RCCACtrl'

        },
        "sow": {
            templateUrl: 'plugins/sow/sow.html',
            controller: 'sowController as SOWCtrl'
        },
        "test_case_instances": {
            templateUrl: 'plugins/test_case_instances/test_case_instances.html',
            controller: 'testCaseInstancesController as TCICtrl'

        },
        "test_cases": {
            templateUrl: 'plugins/test_cases/test_cases.html',
            controller: 'testCasesController as TCCtrl',

        },"test_plan": {
            templateUrl: 'plugins/test_plan/test_plan.html',
            controller: 'testPlanController as TPCtrl'

        },
        "web_lab": {
            templateUrl: 'plugins/web_lab/web_lab.html',
            controller: 'webLabController as WLCtrl'
        },
        "test_strategy":{
            templateUrl: 'plugins/test_strategy/test_strategy.html',
            controller: 'testStrategyController as TSCtrl'
        },
        "plugins_config": {
            // This one is not used any More
            endpointServer: location.protocol+'//'+location.host
        }


    });


})();