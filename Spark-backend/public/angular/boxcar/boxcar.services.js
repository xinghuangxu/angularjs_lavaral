/**
 * Module service definition for Spark Boxcar module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.boxcar')
        .factory('boxcarScopeService', boxcarScopeService);

    boxcarScopeService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about boxcar scopes
     */
    function boxcarScopeService ($resource)
    {
        return $resource("rest/scopes", {
                boxcar: '@boxcar',
                perpage: 'all'
            },
            {
                get: {
                    isArray: true
                }
            }
        );
    }
})();
