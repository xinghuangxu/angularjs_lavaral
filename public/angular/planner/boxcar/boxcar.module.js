/**
 * Module configuration and setup for Spark Boxcar test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-01
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.boxcar', [
            'angular-spinkit',
            'mgcrea.ngStrap',
            'spark.ui',
            'spark.planner',
            'spark.boxcar',
            'spark.testStrategy.editor',
            'spark.planner.settings'
        ]);
})();
