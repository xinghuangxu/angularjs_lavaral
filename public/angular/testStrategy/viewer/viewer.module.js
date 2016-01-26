/**
 * Application configuration and setup for Spark test strategy viewer
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 *
 */

(function() {
    'use strict';

    angular.module('spark.testStrategy.viewer', [
        'ngSanitize',
        'wysiwyg.module',
        'mgcrea.ngStrap',
        'spark.ui',
        'spark.common',
        'spark.planner.testplan'
    ])
})();
