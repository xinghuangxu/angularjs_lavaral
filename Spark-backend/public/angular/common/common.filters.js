/**
 * Module service definition for Spark common module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-06
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.common')
        .filter('sqlDateTime', sqlDateTime);

    /**
     * Filter for handling dates from SQL Server
     */
    function sqlDateTime () {
        /**
         * Format the given input string into a date
         * 
         * @param {string} string SQL formatted timestamp
         * @return {string} Locale date string
         */
        return function(str, format){
            // string like '2013-12-09 10:46:35:527'
            // replace space with 'T' to conform to ISO format
            // Only really needed for Firefox
            var date = new Date(str.replace(/ /, 'T'));
            return date.toISOString();
        }
    }
})();
