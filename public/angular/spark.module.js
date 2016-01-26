/**
 * Application configuration and setup for Spark application
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark', [
            'ngRoute',
            'spark.planner',
            'spark.testStrategy',
            'spark.nav',
        ])
        .config(Router)
        .config(Alerts)
        .config(Modals);

    Router.inject = [ '$routeProvider', '$modalProvi' ];
    function Router($routeProvider) {
        $routeProvider
            .otherwise({
                templateUrl: 'angular/planner/planner.tpl.html',
                controller: 'Main',
                controllerAs: 'main'
            });
    };

    Alerts.$inject = [ '$alertProvider' ];
    /**
     * Configure ngStrap alert defaults
     */
    function Alerts($alertProvider) {
        angular.extend($alertProvider.defaults, {
            placement: 'top',
            container: '#main-view',
            duration: 5
        });
    }

    Modals.$inject = [ '$modalProvider' ];
    /**
     * Configure ngStrap modal defaults
     */
    function Modals($modalProvider) {
        angular.extend($modalProvider.defaults, {
            templateUrl: 'angular/common/modal.tpl.html'
        });
    }
})();
