/**
 * Navigation controller for Spark
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */
(function() {
    'use strict';

    angular
        .module('spark.nav')
        .controller('NavUser', NavUser);

    NavUser.$inject = [ 'userService', 'errorService', '$modal' ];
    /**
     * Controller for the navigation bar
     */
    function NavUser (userService, errorService, $modal) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;
        vm.svc = userService;
        
        activate();
        
        /**
         * Initialize the controller
         */
        function activate() {
            userService.check().then(function() {
                if(!vm.svc.user || !vm.svc.user.Username) {
                    login(true);
                }
            });
        }
        
        /**
         * Open the login modal
         */
        function login(force) {
            userService.login(force);
        }
        
        /**
         * Log the user out
         */
        function logout() {
            userService.logout();
            userService.login(true);
        }
    }
})();
