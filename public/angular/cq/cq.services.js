/**
 * Module service definition for Spark CQ module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.cq')
        .factory('releasesService', releasesService);

    releasesService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about releases in ClearQuest
     */
    function releasesService ($resource){
        return $resource('/rest/cq/releases/', { fields: "name" }, {});
    }
})();
