/**
 * Application configuration and setup for Spark test strategy services
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testStrategy', [
            'ngRoute',
            'spark.error',
            'spark.testStrategy.editor',
            'spark.testStrategy.search',
            'spark.testStrategy.viewer'
        ])
        .config(Router);

    Router.inject = [ '$routeProvider' ];
    function Router($routeProvider) {
        $routeProvider
            .when('/strategy/:strategyId?', {
                templateUrl: 'angular/testStrategy/testStrategy.tpl.html',
                controller: 'Strategy',
                controllerAs: 'strategy'
            });
    };
})();
