(function() {
    'use strict';
    angular
        .module('spark.scope')
        .controller('Scope', Scope);

    Scope.$inject = ['globalFilterService','$routeParams','tabs','tabs_content','sub_tabs_content','$scope','$interval'];

    function Scope (filter,$routeParams,tabs,tabs_content,sub_tabs_content,$scope,$interval) {

        var scopeCtrl = this;
        scopeCtrl.tab = $routeParams.tab;
        scopeCtrl.sub_tab = $routeParams.sub_tab;

        scopeCtrl.tabs =tabs;
        scopeCtrl.tabs_content=tabs_content;
        scopeCtrl.sub_tabs_content = sub_tabs_content;
        scopeCtrl.panelActiveByDefault=-1;
        scopeCtrl.progress_bar_states=[
        {name:"Submitted", active:false},
        {name:"Candidate",active:false},
        {name:"Init scope",active:true},
        {name:"Define",active:false},
        {name:"Ready for Implementation",active:false},
        {name:"Implementation",active:false},
        {name:"Complete",active:false},
        {name:"Approved",active:false}];


   $scope.gridOptions = typeof   sub_tabs_content == 'string'?false:{
    showTreeExpandNoChildren: true,
    enableSorting: false,
    enableFiltering:false,
    selectionRowHeaderWidth: 50,
    columnDefs: [
      { name: 'Scope W/Risk',width:'10%' },
      { name: 'Scope',width:'10%' },
      { name: 'Scope Details'}
    ],
        onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;

      // call resize every 200 ms for 2 s after modal finishes opening - usually only necessary on a bootstrap modal
      $interval( function() {
        $scope.gridApi.core.handleWindowResize();
      }, 10, 500);
      },
      data:  sub_tabs_content
  };




    }




})();
