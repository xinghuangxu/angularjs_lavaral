/**
 * Flash services for alerting user to field changes
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.ui')
        .service('$flash', flashService);
    
    flashService.$inject = ['$timeout'];
    /**
     * Service for flashing html input fields
     */
    function flashService($timeout) {
        return function(element) {
            $(element).addClass('in');
            $timeout(function() {
                $(element).removeClass('in');
            }, 1000, false);
            
        }
    }
})();
