/**
 * Module configuration and setup for Spark test plan test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-11-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.testplan', [
            'angular-spinkit',
            'mgcrea.ngStrap',
            'spark.ui',
            'spark.testStrategy.editor',
            'spark.testplan',
            'spark.planner',
            'spark.planner.settings'
        ]);
})();
