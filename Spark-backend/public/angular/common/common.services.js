/**
 * Module service definition for Spark common module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.common')
        .factory('testStackService', testStackService);

    testStackService.$inject = [ '$resource' ];
    /**
     * Fetch information about test stack layers and their subLayers
     */
    function testStackService ($resource) {
        var testStack = {
            stack: $resource('/rest/planner/stacks/:stack', {},
                {
                    asOptions: {
                        method: 'GET',
                        params: { optionsList: true },
                    }
                }),
            substack: $resource('/rest/planner/stacks/:stack/substacks/:substack', {},
                {
                    asOptions: {
                        method: 'GET',
                        params: { optionsList: true }
                    }
                })
        };

        return testStack;
    }
})();
