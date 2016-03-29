/**
 * Module service definition for Spark test strategy view module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-07
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testStrategy.editor')
        .factory('strategyViewService', strategyViewService);

    strategyViewService.$inject = [];

    /**
     * Service for viewing information about strategies 
     */
    function strategyViewService () {
        var viewing = {
            current: null
        };
        
        return viewing;
    }

})();
