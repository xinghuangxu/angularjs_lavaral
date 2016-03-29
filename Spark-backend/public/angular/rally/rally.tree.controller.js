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
        .module('spark.rally')
        .controller('rallyTreeCtrl', rallyTreeCtrl);


    rallyTreeCtrl.$inject = ['$scope', 'rallyDataService', '$alert', '$log', 'errorService']; // $scope, rallyDataService, rallyDataSet, $alert, $log

    function rallyTreeCtrl($scope, rallyDataService, $alert, $log, settings){

        var vm = this;

        vm.views= {
             STATUS: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_qual_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'Status'
             },
             OWNER: {
                 // the following lines have been commented because we are going to use them later
//                 value: 'tags_impact_area',
//                 type: 'object',
//                 index: 'CategoryID',
//                 label: 'CategoryName',
                 text: 'owner'
             },
             PLANSTATUS: {
                 value: null,
                 text: 'Plan Status'
             },
             ITERATION: {
                 value: null,
                 text: 'Iteration'
             },
             NONE: {
                 value: null,
                 text: 'None'
             }
        }

        vm.config = {
                groupBy: vm.views,
                activeGroup: vm.views.NONE,
            };


        $scope.data = {};
        $scope.undoArray = [];

        $scope.$on("RallyLoadTree", function (event, data){
            $scope.SelectedProject = data.project;
            $scope.SelectedRelease = data.release;
            $scope.SelectedIteration = data.iteration;
            $scope.getTreeData();
        });

        //Function to request tree data
        $scope.getTreeData = function () {
            $scope.$emit("RallyLoad");
            rallyDataService.RallyData.treeData({
            project: $scope.SelectedProject,
            release: $scope.SelectedRelease,
            iteration: $scope.SelectedIteration
            }).$promise
                .then(function (val, response) {
//                    console.log("TreeData: ", val.data);
                    $scope.tree = val.data;
                    $scope.undoArray = [];
                    $scope.load = false;
                    $scope.$emit("RallyLoadComplete");
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                });
        };


    }
})();
