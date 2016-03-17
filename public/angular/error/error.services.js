/**
 * Module service definition for Spark error handling
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.error')
        .factory('errorService', errorService);

    errorService.$inject = [ '$alert' ];

    /**
     * Service for displaying messages to the user
     */
    function errorService ($alert) {
        return {
            success: showSuccess,
            warning: showWarning,
            error: showError,
            container: getParentElement()
        };
        
        /**
         * Show a success message
         * 
         * @param {string} message Message to display
         * @return {object} $alert object created by ngStrap for use by the caller
         */
        function showSuccess(message) {
            return $alert({
                type: 'success',
                title: 'Success',
                content: message,
                container: getParentElement()
            });
        }
        
        /**
         * Show a warning message
         * 
         * @param {string} message Message to display
         * @return {object} $alert object created by ngStrap for use by the caller
         */
        function showWarning(message) {
            return $alert({
                type: 'warning',
                title: 'Warning',
                content: message,
                container: getParentElement()
            });
        }
        
        /**
         * Show an error message
         * 
         * @param {string} message Message to display
         * @return {object} $alert object created by ngStrap for use by the caller
         */
        function showError(message) {
            return $alert({
                type: 'danger',
                title: 'Error',
                content: message,
                container: getParentElement()
            });
        }
        
        /**
         * Find the correct element to parent the modal to
         * 
         * If a modal is already open, we want to display errors on the topmost
         * modal. This function searches the DOM for modals and will return
         * the last one found, or a default selector if none are open.
         * 
         * @return {string|object} CSS selector string or object to parent to  
         */
        function getParentElement() {
            // TODO: Figure out if we can do without this jQuery selector
            var modals = $('.modal-dialog .modal-body');
            if(modals.length > 0) {
                return modals.last();
            }
            
            return '#main-view';
        }
    }
})();
