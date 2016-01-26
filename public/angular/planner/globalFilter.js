/**
 * Primary controllers for the test planning module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.planner')

        .factory('globalFilterService', GlobalFilter);

    GlobalFilter.$inject = [];
    /**
     * Service provider for shared filter functions
     */
    function GlobalFilter() {
        var filter = {
            text: null
        };

        return filter;
    }
})();