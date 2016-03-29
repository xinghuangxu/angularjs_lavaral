/**
 * Created by e897x724 on 3/21/2016.
 */
(function () {
    'use strict';

    angular.module('commonComponents').constant('pluginNamesConstant', {

        "architecture_documents": {
            templateUrl: 'architecture_documents/architecture_documents.html',
            controller: 'architectureDocumentsController as architectureDocumentsController'

        },
        "boxcar": {
            templateUrl: 'boxcar/boxcar.html',
            controller: 'boxcarController as boxcarController'

        },
        "configuration_plan": {
            templateUrl: 'configuration_plan/configuration_plan.html',
            controller: 'configurationPlanController as configurationPlanController'

        },
        "high_level_scope": {
            templateUrl: 'high_level_scope/high_level_scope.html',
            controller: 'highLevelScopeController as highLevelScopeController'

        },
        "implementation_requests": {
            templateUrl: 'implementation_requests/implementation_requests.html',
            controller: 'implementationRequestsController as implementationRequestsController'


        },
        "rally": {
            templateUrl: 'rally/rally.html',
            controller: 'rallyController as rallyController'

        },
        "rcca": {
            templateUrl: 'rcca/rcca.html',
            controller: 'rccaController as rccaController'

        },
        "sow": {
            templateUrl: 'sow/sow.html',
            controller: 'sowController as sowController'
        },
        "test_case_instances": {
            templateUrl: 'test_case_instances/test_case_instances.html',
            controller: 'testCaseInstancesController as testCaseInstancesController'

        },
        "test_cases": {
            templateUrl: 'test_cases/test_cases.html',
            controller: 'testCasesController as testCasesController'

        },"test_plan": {
            templateUrl: 'test_plan/test_plan.html',
            controller: 'testPlanController as testPlanController'

        },
        "web_lab": {
            templateUrl: 'web_lab/web_lab.html',
            controller: 'webLabController as webLabController'

        }


    });


})();