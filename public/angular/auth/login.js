/**
 * Controllers for authentication and login services
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.auth')
        .controller('LoginModal', LoginModal);

    LoginModal.$inject = ['$scope', 'userService', 'authService'];
    /**
     * Controller for the login modal dialog
     */
    function LoginModal ($scope, userService, authService) {
        var vm = this;
        vm.$hide = close;
        vm.login = login;
        
        /**
         * Close the modal dialog
         */
        function close() {
            vm.username = null;
            vm.password = null;
            $scope.$parent.$hide();
        }
        
        /**
         * Attempt to log the user in on the server
         * 
         * @param {object} $event Optional parameter to handle key event data
         */
        function login($event) {
            if(!$event || ($event && $event.keyCode === 13)) {
                vm.error = null;
                
                // Username and password are required
                if(!vm.username || !vm.password) {
                    vm.error = "Username or password not set";
                    return;
                }
                
                authService.login({
                        username: vm.username,
                        password: vm.password
                    })
                    .$promise.then(function(result){
                        userService.user = result;
                        $scope.$parent.$hide();
                    }, function(error){
                        if(error.status === 401) {
                            vm.error = "Invalid username or password";
                        } else {
                            vm.error = "Unknown error logging in";
                        }
                        
                        vm.password = null;
                    });
            }
        }
    }
})();
