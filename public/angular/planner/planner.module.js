/**
 * Application configuration and setup for Spark test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular.module('spark.planner', [
        'ui.sortable',
        'spark.ui',
        'spark.common',
        'spark.planner.settings',
        'spark.planner.boxcar',
        'spark.planner.testplan',
        'spark.testStrategy',
        'spark.cq'
    ])
})();
