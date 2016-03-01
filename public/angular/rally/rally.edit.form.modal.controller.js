(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.rally')
        .controller('rallyEditFormModalCtrl', rallyEditFormModalCtrl);

     rallyEditFormModalCtrl.$inject = ['$scope', 'editModalData','rallyDataService','$alert'];
     function rallyEditFormModalCtrl($scope,editModalData,rallyDataService,$alert){






                    $scope.releaseList = editModalData.releaseList.data;
                    $scope.ownerList = editModalData.ownerList.data;
                    $scope.iterationList = editModalData.iterationList.data;
                    $scope.stateList = ['Defined','In-Progress','Completed','Accepted'];

                    $scope.pointList =[0,1,2,3,5,8,13,21];
                    $scope.pointList.indexOf(editModalData.editFormData.data.points)==-1?
                    $scope.pointList.push(editModalData.editFormData.data.points):'';

                      $scope.editNodeFormData={
                    nodeTitle:editModalData.editFormData.data.Title,
                    selectedOwner:editModalData.editFormData.data.Owner||$scope.ownerList[0],
                    selectedState:editModalData.editFormData.data.state,
                    selectedRelease:editModalData.release,
                    selectedPoint:editModalData.editFormData.data.points,
                    selectedIteration:editModalData.editFormData.data.Iteration?
                    editModalData.editFormData.data.Iteration._refObjectName:null,
                    description:editModalData.editFormData.data.description,
                    nodeID:editModalData.editFormData.data.id,
                    architecturalTopicId:editModalData.editFormData.data.arch



                    };


            $scope.submit = function (submitType){


                var arg = {
                    project: editModalData.project,
                    title: $scope.editNodeFormData.nodeTitle,
                    owner: $scope.editNodeFormData.selectedOwner,
                    state: $scope.editNodeFormData.selectedState,
                    release:$scope.editNodeFormData.selectedRelease,
                    points: $scope.editNodeFormData.selectedPoint,
                    iteration: $scope.editNodeFormData.selectedIteration,
                    description: $scope.editNodeFormData.description,
                    newNodeID: editModalData.nodeId,
                    arch: $scope.editNodeFormData.architecturalTopicId
                }
                rallyDataService.RallyDataUpdate.updateNode(arg,{}).$promise
                .then(function (val, response) {
                   $scope.editNodeFormData={
                    nodeTitle:null,
                    selectedOwner:null,
                    selectedState:null,
                    selectedRelease:editModalData.release,
                    selectedPoint:null,
                    selectedIteration:null,
                    description:null,
                    nodeID:null,
                    architecturalTopicId:null



                    };

                    $alert({
                        title: 'User story added under Release: ' + editModalData.release,
                        content: "User Story Moved",
                        placement: 'top',
                        type: 'info'

                    }).show();
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        type: 'danger'
                    }).show();
                });
            };


     }})();
