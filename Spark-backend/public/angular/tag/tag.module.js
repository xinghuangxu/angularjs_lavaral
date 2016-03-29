/**
 * Module configuration and setup for Spark tag module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.tag', [
            'ngResource',
            'angular-spinkit',
            'spark.error',
            'spark.ui'
        ]);
})();
