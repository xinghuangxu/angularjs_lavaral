/**
 * Application configuration and setup for Spark test strategy editor
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 *
 */

(function() {
    'use strict';

    angular.module('spark.testStrategy.editor', [
        'ngSanitize',
        'wysiwyg.module',
        'mgcrea.ngStrap',
        'ui.event',
        'spark.ui',
        'spark.common',
        'spark.tag',
        'spark.requirements',
        'spark.testcase',
        'spark.planner.testplan'
    ])
})();
