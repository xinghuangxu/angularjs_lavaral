/**
 * Module service definition for Spark requirements module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.requirements')
        .factory('requirementsService', requirementsService)
        .service('$requirements', requirementsModalService);

    requirementsService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about tags
     */
    function requirementsService ($resource){
        return $resource('/rest/requirements', {perpage: 'all'}, {
            adhocs: {
                url: 'rest/requirements/adhocs/:id?',
                method: 'GET',
                isArray: true
            },
            archdocs: {
                url: '/rest/requirements/archdocs/:id?',
                method: 'GET',
                isArray: true
            }
        });
    }
    
    requirementsModalService.$inject = ['$rootScope', '$modal', '$timeout', '$q'];
    /**
     * Service provider for modal to select requirements
     */
    function requirementsModalService($rootScope, $modal, $timeout, $q) {
        return function(dest) {
            var modalScope = $rootScope.$new();
            
            modalScope.add = addReqs;
            modalScope.dest = dest;
            
            var modal = $modal({
                title: 'Add Requirements',
                contentTemplate: '/angular/requirements/requirementsModal.tpl.html',
                controller: 'AddRequirements',
                controllerAs: 'reqs',
                scope: modalScope
            });
            
            var deferred = $q.defer();
            modal.$promise = deferred.promise;
            
            var parentHide = modal.hide;
            modal.hide = hide;
            
            return modal;
            
            /**
             * Hide the modal
             */
            function hide() {
                deferred.resolve(true);
                parentHide();
            }
            
            /**
             * Add the given requirement to the destination
             * 
             * @param {string} type Field name in the destination to append to
             * @param {object} item Item to add to the array
             */
            function addReqs(type, item) {
                if(!modalScope.dest.hasOwnProperty(type) || !Array.isArray(modalScope.dest[type])) {
                    return;
                }
                
                if(modalScope.dest[type].indexOf(item) < 0) {
                    // Don't add dupes
                    modalScope.dest[type].push(item);
                    item.added = true;
                }
            }
        }
    }
})();
