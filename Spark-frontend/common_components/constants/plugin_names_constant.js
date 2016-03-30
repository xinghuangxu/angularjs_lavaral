/**
 * Created by e897x724 on 3/21/2016.
 */
(function () {
    'use strict';

    angular.module('commonComponents').constant('pluginNamesConstant', {

        "architecture_documents": {
            templateUrl: 'plugins/architecture_documents/architecture_documents.html',
            controller: 'architectureDocumentsController as architectureDocumentsController'

        },
        "boxcar": {
            templateUrl: 'plugins/boxcar/boxcar.html',
            controller: 'boxcarController as boxcarController'

        },
        "configuration_plan": {
            templateUrl: 'plugins/configuration_plan/configuration_plan.html',
            controller: 'configurationPlanController as configurationPlanController'

        },
        "high_level_scope": {
            templateUrl: 'plugins/high_level_scope/high_level_scope.html',
            controller: 'highLevelScopeController as highLevelScopeController'

        },
        "implementation_requests": {
            templateUrl: 'plugins/implementation_requests/implementation_requests.html',
            controller: 'implementationRequestsController as implementationRequestsController'


        },
        "rally": {
            templateUrl: 'plugins/rally/rally.html',
            controller: 'rallyController as rallyController'

        },
        "rcca": {
            templateUrl: 'plugins/rcca/rcca.html',
            controller: 'rccaController as rccaController'

        },
        "sow": {
            templateUrl: 'plugins/sow/sow.html',
            controller: 'sowController as sowController'
        },
        "test_case_instances": {
            templateUrl: 'plugins/test_case_instances/test_case_instances.html',
            controller: 'testCaseInstancesController as testCaseInstancesController'

        },
        "test_cases": {
            templateUrl: 'plugins/test_cases/test_cases.html',
            controller: 'testCasesController as testCasesController'

        },"test_plan": {
            templateUrl: 'plugins/test_plan/test_plan.html',
            controller: 'testPlanController as testPlanController'

        },
        "web_lab": {
            templateUrl: 'plugins/web_lab/web_lab.html',
            controller: 'webLabController as webLabController'

        }


    });


})();