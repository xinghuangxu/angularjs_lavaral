/**
 * Controllers for the requirements selection services
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-14
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark')
        .controller('archdocsController', archdocsController);

    archdocsController.$inject = ['$scope'];
    /**
     * Controller for the modal to search and add requirements
     */
    function archdocsController($scope) {
        
      $scope.msg='hello';
        
//        var vm = this; 
//        vm.data = {}; 
//        
//        vm.PopoverId = "popover.html";
//        
//        $scope.$on("RallySettingChanged", function (event, data){
//            $scope.SelectedProject = data.project; 
//            $scope.SelectedRelease = data.release;
////            console.log("Selected Project", $scope.SelectedProject);
////            console.log("Selected Release", $scope.SelectedRelease);
////            console.log("RallyChanged", data.project);
//            vm.getIteration(data.project);
//            $scope.$broadcast("RallyLoadTree", vm.data);
//        });
//        
//        $scope.$on("RallyResponseHandle", function (event, data){
//            $scope.$emit("Alert", {
//                title: "Rally Backend Service Alert",
//                content: "Backend Service Error!",
//            });
//        });
//        
//        $scope.RallyIterationChange = function (data){
//            $scope.SelectedIteration = data;
//            $scope.$broadcast("RallyLoadTree", data);
//        };
//        
//        vm.getIteration = function (project){
//            rallyDataService.iterations.IterationList({input: project}).$promise
//                .then(function (val, response) {
////                    console.log("data ", val.data);
//                    $scope.IterationList = val.data;
////                    console.log("in scope ", $scope.IterationList);
//                })
//                .catch(function (response) {
//                    $alert({
//                        title: "Error fetching Rally domains",
//                        content: "There was an error fetching the list of Projects from the server.",
//                        placement: 'top',
//                        container: '.modal-dialog'
//                    });
//                });
//        };
    }
    

})();
