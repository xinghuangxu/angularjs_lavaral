/**
 * Module service definition for Spark authentication module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.auth')
        .factory('authService', authService)
        .factory('userService', userService);

    authService.$inject = [ '$resource' ];
    /**
     * Service for authenticating a user
     */
    function authService ($resource) {
        return $resource('/ldapCheck', {}, {
            login: {
                url: '/ldapAuth',
                method: 'POST'
            },
            logout: {
                url: '/ldapLogout',
                method: 'POST'
            }
        });
    }
    
    userService.$inject = [ 'authService', 'errorService', '$modal' ];
    /**
     * Service for handling data about the current user
     */
    function userService(authService, errorService, $modal) {
        var data = {
            user: null,
            login: login,
            logout: logout,
            check: check
        };
        
        return data;
        
        /**
         * Show the login modal
         * 
         * @param {boolean} force Require the user to log in before the modal closes
         */
        function login(force) {
            // Modal options
            var options = {
                title: "Log in to Spark",
                controller: 'LoginModal',
                controllerAs: 'login',
                templateUrl: 'angular/auth/login.tpl.html',
            };

            // Force the login (i.e. the login window can't be closed until you log in)
            if(force) {
                angular.extend(options, {
                    backdrop: 'static',
                    keyboard: false
                });
            }

            $modal(options);
        }

        /**
         * Log the current user out
         * 
         * @return {object} Promise from the auth service for other controllers to chain onto
         */
        function logout() {
            var promise = authService.logout().$promise
                .then(function(result) {
                    data.user = null;
                })
                .catch(function(error) {
                    errorService.warning('There was an error logging out');
                });

            return promise;
        }

        /**
         * Get any login info from the server if it exists
         * 
         * @return {object} Promise from the auth service for other controllers to chain onto
         */
        function check() {
            var promise = authService.get().$promise
                .then(function(result) {
                    if(result.Username) {
                        data.user = result;
                    }
                })
                .catch(function(error) {
                    errorService.warning('There was an error checking the current user');
                });

            return promise;
        }
    }
})();
