/**
 * Module service definition for Spark tag module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.tag')
        .factory('tagService', tagService)
        .service('$tags', tagModalService);

    tagService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about tags
     */
    function tagService ($resource){
        return $resource('/rest/tags', {}, {
            qual: {
                url: '/rest/tags/qual-areas',
                method: 'GET',
                isArray: true
            },
            impact: {
                url: '/rest/tags/impact-areas',
                method: 'GET',
                isArray: true
            },
            approach: {
                url: '/rest/tags/test-approaches',
                method: 'GET',
                isArray: true
            },
        });
    }
    
    tagModalService.$inject = ['$rootScope', '$modal', '$timeout', '$q'];
    /**
     * Service provider for a modal dialog to edit tags
     */
    function tagModalService($rootScope, $modal, $timeout, $q) {
        return function(type, dest) {
            var modalScope = $rootScope.$new();
            
            modalScope.add = addTags;
            modalScope.dest = dest;
            modalScope.selectTag = selectTag;
            
            switch(type) {
                case 'qual':
                    modalScope.tagType = 'qual';
                    break;
                case 'impact':
                default:
                    modalScope.tagType = 'impact';
                    modalScope.multi = true;
                    break;
            };
            
            var modal = $modal({
                title: 'Add Impact Area Tag',
                templateUrl: '/angular/tag/tagModal.tpl.html',
                controller: 'AddTag',
                controllerAs: 'tags',
                scope: modalScope
            });
            var deferred = $q.defer();
            modal.$promise = deferred.promise;
            
            var parentHide = modal.hide;
            modal.hide = hide;
            
            return modal;
            
            /**
             * Return the tags to the parent controller
             * @param {array} tags List of tags to send back
             */
            function addTags(tags, dest) {
                if(!dest) {
                    // No target given
                    return;
                }
                
                if(modalScope.multi) {
                    var count = 0; 
                    angular.forEach(tags, function(val, key) {
                        if(dest.indexOf(val.data) < 0) {
                            dest.push(val.data);
                            count++;
                        }
                    });
                    
                    modalScope.message = 'Added ' + count + ' tags to strategy.';
                    $timeout(function(){
                        modalScope.message = null;
                    }, 2000);
                } else if(tags.length > 0) {
                    dest.splice(0, dest.length);
                    dest.push(tags[0].data);
                }
            }
            
            /**
             * Add the given tag to the output and close the modal
             * 
             * Only triggers on modals where multi == false
             */
            function selectTag(data) {
                if(!modalScope.multi) {
                    addTags([data.node], modalScope.dest);
                    modal.hide();
                }
            }
            
            /**
             * Hide the modal
             */
            function hide() {
                deferred.resolve(true);
                parentHide();
            }
        }
    }
})();
