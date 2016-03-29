/**
 * Module configuration and setup for Spark testcase module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testcase', [
            'ngResource',
            'angular-spinkit',
            'spark.error',
            'spark.ui',
            'mgcrea.ngStrap'
        ]);
})();
