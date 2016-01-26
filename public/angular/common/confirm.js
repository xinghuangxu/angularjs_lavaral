/**
 * Service for confirmation dialogs
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.common')
        .service('$confirm', confirmModal);
    
    confirmModal.$inject = ['$modal', '$rootScope', '$q'];
    /**
     * Service to provide a modal with ok/cancel buttons
     */
    function confirmModal($modal, $rootScope, $q) {
        return modal;
        
        /**
         * Modal configuration and setup
         * 
         * @param {object} options Options for the $modal service
         * @return {object} $modal with the promise bound to the accept/cancel buttons.
         */
        function modal(options) {
            var modalScope = $rootScope.$new();
            var defaults = {
                title: 'Confirm',
                content: 'Are you sure?',
                templateUrl: '/angular/common/confirm.tpl.html',
                scope: modalScope
            };
            
            var m = $modal(angular.merge(defaults, options)); 
            var deferred = $q.defer();
            m.$promise = deferred.promise;
            
            modalScope.answer = answer;
            
            return m;
            
            /**
             * Resolve the promise
             * 
             * @response {boolean} Resolve or reject the promise
             */
            function answer(response) {
                if(response) {
                    deferred.resolve(response);
                } else {
                    deferred.reject();
                }
                m.hide();
            }
        }
    }
})();
