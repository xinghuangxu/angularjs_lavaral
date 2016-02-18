/**
 * Module configuration and setup for Spark test planning module settings
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.settings', [
            'ngResource',
            'mgcrea.ngStrap',
            'angular-spinkit',
            'spark.alm',
            'spark.rally'
        ]);
})();
