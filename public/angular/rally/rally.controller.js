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
        .controller('rallyController', rallyController);

    rallyController.$inject = ['$scope', 'rallyDataService', 'errorService','testplanSettingsService'];
    /**
     * Controller for the modal to search and add requirements
     */
    function rallyController($scope, rallyDataService,testplanSettingsService) {
        var vm = this;
        $scope.data = {};
        $scope.SelectedProject='';
        $scope.SelectedRelease='';
        $scope.SelectedIteration='';

 $scope.$on('planSettingChanged', function(event,settings) {
    console.log('rally catch');
    console.log(settings.data);
    var rally_project_id = settings.data.rally_project_id;
    var rally_release_id = settings.data.rally_release_id;

    if(rally_release_id && rally_release_id)
    {
        $scope.$broadcast("RallyLoadTree", {project: $scope.SelectedProject,
                        release:$scope.SelectedRelease,
                        iteration:$scope.SelectedIteration });
    }

  });


        $scope.PopoverId = "popover.html";

        $scope.$on("RallySettingChanged", function (event, data){
            $scope.SelectedProject = data.project;
            $scope.SelectedRelease = data.release;
            $scope.SelectedIteration = data.iteration;
            $scope.getIteration($scope.SelectedProject);
            $scope.$broadcast("RallyLoadTree", data);
        });

        $scope.$on("RallyResponseHandle", function (event, data){
            $scope.$emit("Alert", {
                title: "Rally Backend Service Alert",
                content: "Backend Service Error!",
            });
        });

        $scope.RallyIterationChange = function (iteration){
            var data = {project: $scope.SelectedProject,
                        release:$scope.SelectedRelease,
                        iteration:iteration}
            $scope.SelectedIteration = iteration;
            $scope.$broadcast("RallyLoadTree", data);
        };

        $scope.getIteration = function (project){
            rallyDataService.iterations.IterationList({input: project}).$promise
                .then(function (val, response) {
//                    console.log("data ", val.data);
                    $scope.IterationList = val.data;
//                    console.log("in scope ", $scope.IterationList);
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
