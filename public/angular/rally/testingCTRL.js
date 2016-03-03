(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.rally')
        .controller('testingCtrl', testingCtrl);

     testingCtrl.$inject = ['$scope'];
     function testingCtrl($scope){

                $scope.msg="hello";


     }})();
