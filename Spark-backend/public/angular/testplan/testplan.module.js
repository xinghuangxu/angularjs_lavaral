/**
 * Module configuration and setup for Spark testplan module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-11-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testplan', [
            'ngResource',
            'mgcrea.ngStrap',
            'spark.testStrategy'
        ]);

})();
