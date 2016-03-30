/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function () {
    'use strict';

    angular.module('spark').config(scopeRouteConfig);
    scopeRouteConfig.$inject = [
        "$stateProvider",
        "$urlRouterProvider"
    ];
    function scopeRouteConfig($stateProvider,$urlRouterProvider) {

        $stateProvider
            .state('scope_base_template', {
                abstract:true,
                templateUrl: "scope/scope.html",
                controller: "scopeController as scopeController"
            }).state('scope_base_template.scope_partials', {
            abstract:true,
            views: {
                header: {
                    templateUrl: "scope/partials/header/_header.html"
                },
                right_side_bar: {
                    templateUrl: "scope/partials/right_side_bar/_right_side_bar.html"
                },
                content_wrapper: {
                    templateUrl: "scope/partials/content_wrapper/_content_wrapper.html"
                },
                left_side_bar: {

                    templateUrl: "scope/partials/left_side_bar/_left_side_bar.html"
                },
                footer: {
                    templateUrl: "scope/partials/footer/_footer.html"
                }


            }
        }).state('scope_base_template.scope_partials.scope', {
            url: "/scope",
            template:'<h1> Scope</h1>'

        });




    }





})();
