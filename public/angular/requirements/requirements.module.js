/**
 * Module configuration and setup for Spark requirements module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-14
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.requirements', [
            'ngResource',
            'angular-spinkit',
            'spark.error',
            'spark.ui'
        ]);
})();
