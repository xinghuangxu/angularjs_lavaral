(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.rally')
        .controller('rallyAddFormModalCtrl', rallyAddFormModalCtrl);

     rallyAddFormModalCtrl.$inject = ['$scope', 'addModalData','rallyDataService','$alert'];
     function rallyAddFormModalCtrl($scope,addModalData,rallyDataService,$alert){

                    $scope.newNodeForm={
                    nodeTitle:null,
                    selectedOwner:null,
                    selectedState:null,
                    selectedRelease:addModalData.release,
                    selectedPoint:null,
                    selectedIteration:null,
                    description:null,
                    nodeID:null,
                    architecturalTopicId:null



                    };
                    $scope.releaseList = addModalData.releaseList.data;
                    $scope.ownerList = addModalData.ownerList.data;
                    $scope.iterationList = addModalData.iterationList.data;
                    $scope.stateList = ['Defined','In-Progress','Completed','Accepted'];

                    $scope.pointList =[0,1,2,3,5,8,13,21];


            $scope.submit = function (submitType){


                var arg = {
                    project: addModalData.project||'',
                    title: $scope.newNodeForm.nodeTitle||'',
                    owner: $scope.newNodeForm.selectedOwner||'',
                    state: $scope.newNodeForm.selectedState||'',
                    release:$scope.newNodeForm.selectedRelease||'',
                    points: $scope.newNodeForm.selectedPoint||'',
                    iteration: $scope.newNodeForm.selectedIteration||'',
                    description: $scope.newNodeForm.description||'',
                    newNodeID: addModalData.nodeId||'',
                    arch: $scope.newNodeForm.architecturalTopicId||''
                }
                rallyDataService.RallyDataCreate.AddNode(arg).$promise
                .then(function (val, response) {
                   $scope.newNodeForm={
                    nodeTitle:null,
                    selectedOwner:null,
                    selectedState:null,
                    selectedRelease:addModalData.release,
                    selectedPoint:null,
                    selectedIteration:null,
                    description:null,
                    nodeID:null,
                    architecturalTopicId:null



                    };

                    $alert({
                        title: 'User story added under Release: ' + addModalData.release,
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
