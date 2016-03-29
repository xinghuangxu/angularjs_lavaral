/**
 * Module service definition for Spark test strategy editor module
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
        .factory('strategyEditService', strategyEditService);

    strategyEditService.$inject = ['tagService', 'errorService'];

    /**
     * Service for fetching information about testplan scopes
     */
    function strategyEditService (tagService, errorService) {
        var editing = {
            current: null,
            approach: null,
        };
        
        // Fetch the list of valid approaches
        tagService.approach().$promise
            .then(function(data) {
                editing.approach = data;
            })
            .catch(function(error){
                errorService.error(error);
            });
        
        return editing;
    }

})();
