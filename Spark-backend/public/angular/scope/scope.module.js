(function() {
    'use strict';

    angular
        .module('spark.scope', [
            'ngRoute',
            'mgcrea.ngStrap',
            'spark.ui',
            'ngAnimate',
            'ui.grid',
            'ui.grid.treeView'
        ])
        .config(Router);

    Router.inject = [ '$routeProvider' ];
    function Router($routeProvider) {
        $routeProvider.when('/scopedemo',{redirectTo: '/scopedemo/1'})
            .when('/scopedemo/:tab?/:sub_tab?',{
                templateUrl:'angular/scope/scope.tpl.html',
                controller:'Scope',
                controllerAs:'scopeCtrl',
                resolve: {
                tabs: function(scopeTplService,$route){return scopeTplService.getTabs(parseInt($route.current.params.tab))},
                tabs_content:function(scopeTplService,$route){return scopeTplService.getTabContent(parseInt($route.current.params.tab),parseInt($route.current.params.sub_tab))},
                sub_tabs_content:function(scopeTplService,$route){return scopeTplService.getSubTabContent(parseInt($route.current.params.tab),parseInt($route.current.params.sub_tab))}
            }})

    };
})();