/**
 * Navigation module definition
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-04
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.nav', [
            'ngRoute',
            'mgcrea.ngStrap',
            'spark.auth'
        ]);
})();
