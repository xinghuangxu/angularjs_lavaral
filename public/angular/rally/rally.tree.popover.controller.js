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
        .controller('rallyPopoverCtrl', rallyPopoverCtrl);


    rallyPopoverCtrl.$inject = ['$scope', 'rallyDataService', 'rallyDataSet', '$modal', '$alert', '$sce','$q']; //

    function rallyPopoverCtrl($scope, rallyDataService, rallyDataSet, $modal, $alert, $sce,$q){

        var vm = this;
        $scope.data = {};
        //Function when the add button is used
       $scope.addButton = function (){
//            $scope.data.newNodeID = rallyDataSet.selectedNode.nodeID;
//            $scope.newNode = {owner: $scope.data.specificOwner, release: $scope.data.releaseChosen, state: "Defined"};

            var addFormPromises = {
            releaseList:this.releaseList||rallyDataService.releases.releaseList({input: $scope.content.project}).$promise,
            iterationList:this.iterationList||rallyDataService.iterations.IterationList({input: $scope.content.project}).$promise,
            ownerList:rallyDataService.owners.ownersList({input: $scope.content.project}).$promise,
            project :$scope.content.project,
            release :$scope.content.release,
            nodeId :$scope.content.node.id

                };


            var addModal = $modal({
                templateUrl: 'angular/rally/_addForm.html',
                animation:'am-flip-x',
                title:'Create New User Story',
                controller:'rallyAddFormModalCtrl',
                resolve:{


                addModalData:function(){
                return $q.all(addFormPromises).catch(function(){
                     $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });


                })
                    }


                },
                show: true
            });


        };

        //Function when the info button is used
        $scope.infoButton = function (){


        var infoModal = $modal({
                templateUrl: 'angular/rally/_infoModal.html',
                animation:'am-flip-x',
                title:'User Story Information',
                controller:'rallyInfoModalCtrl',
                resolve:{


                infoModalData:function(){
                        return rallyDataService.RallyDataDetails.metadata({input: $scope.content.node.id}).$promise;
                }


                },
                show: true
            });
        };

        //Function when the edit button is used
        $scope.editButton = function (){

          var editFormPromises = {
            releaseList:this.releaseList||rallyDataService.releases.releaseList({input: $scope.content.project}).$promise,
            iterationList:this.iterationList||rallyDataService.iterations.IterationList({input: $scope.content.project}).$promise,
            ownerList:rallyDataService.owners.ownersList({input: $scope.content.project}).$promise,
            editFormData:rallyDataService.RallyDataDetails.metadata({input: $scope.content.node.id}).$promise,
            project :$scope.content.project,
            release :$scope.content.release,
            node :$scope.content.node

                };

        var editModal = $modal({
                templateUrl: 'angular/rally/_editForm.html',
                animation:'am-flip-x',
                title:'Edit User Story',
                controller:'rallyEditFormModalCtrl',
                resolve:{


                editModalData:function(){
                return $q.all(editFormPromises).catch(function(){
                     $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });


                })
                    }


                },
                show: true
            });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//            $scope.data.nodeID = rallyDataSet.selectedNode.nodeID;
//            $scope.data.children = rallyDataSet.selectedNode.children;
//
//            var noAll = $scope.data.releaseList.indexOf('All');
//            $scope.data.exactReleaseList = $scope.data.releaseList.slice(0);
//            $scope.data.exactReleaseList.splice(noAll, 1);
//            $scope.data.exactIterationList = $scope.data.iterationList.slice(0);
//            $scope.data.exactIterationList.pop();
//
//            if ($scope.data.children){
//                $scope.data.parent = true;
//            }
//            else{
//                $scope.data.parent = false;
//            }
//
//            rallyDataService.RallyDataDetails.metadata({input: $scope.data.nodeID}).$promise
//                .then(function (val, response) {
//                    $scope.data.editData = val.data;
//                    $scope.data.staticTitle = val.data.Title;
//                    $scope.data.staticArch = val.data.arch;
//                    $scope.data.staticState = val.data.state;
//                    $scope.data.staticIteration = val.data.iteration;
//                    $scope.data.editData.description = val.data.description;
//                })
//                .catch(function (response) {
//                    $alert({
//                        title: "Error fetching Rally domains",
//                        content: "There was an error fetching the list of Projects from the server.",
//                        placement: 'top',
//                        container: '.modal-dialog'
//                    });
//                });
//
//            var editModal = $modal({
//                    contentTemplate: 'angular/rally/_editForm.html',
//                    scope: $scope.data,
//                    show: true
//                });
//
//            $scope.esubmit = function (esubmitType){
//                rallyDataService.RallyDataUpdate.updateNode({
//                    project: $scope.data.projectChosen,
//                    title: $scope.data.editData.Title,
//                    owner: $scope.data.editData.owner,
//                    points: $scope.data.editData.points,
//                    state: $scope.data.editData.state,
//                    release: $scope.data.editData.release,
//                    iteration: $scope.data.editData.iteration,
//                    description: $scope.data.editData.description,
//                    newNodeID: $scope.data.nodeID,
//                    arch: $scope.data.editData.arch
//                }).$promise
//                .then(function (val, response) {
//                    if ($scope.data.editData.release !== $scope.data.releaseChosen && !$scope.data.children && ($scope.data.releaseChosen !== 'All')){
//                        rallyDataSet.actionNode = $scope.data.nodeID;
//                        rallyDataSet.deleteSuccess = true;
//                        $alert({
//                            title: "Success",
//                            content: 'User story located in Release: ' + $scope.data.editData.release,
//                            placement: 'top',
//                            container: '.modal-dialog'
//                        });
//                    }
//                    if ($scope.data.editData.Title !== $scope.data.staticTitle || $scope.data.editData.iteration !== $scope.data.staticIteration ||
//                            $scope.data.editData.state !== $scope.data.staticState || $scope.data.editData.arch !== $scope.data.staticArch){
//                        rallyDataSet.actionNode = $scope.data.nodeID;
//                        rallyDataSet.editInfo.nodeID = $scope.data.nodeID;
//                        rallyDataSet.editInfo.name = $scope.data.editData.Title;
//                        rallyDataSet.editInfo.archID = $scope.data.editData.arch;
//                        rallyDataSet.editInfo.iteration = $scope.data.editData.iteration;
//                        rallyDataSet.editInfo.icon = val.data.icon;
//                        rallyDataSet.editInfo.blocked = val.data.Blocked;
//
//                    }
//                    switch (esubmitType){
//                        case "close":
//                            $(editModal).modal('hide');
//                            if ($scope.data.editData.release == $scope.data.releaseChosen){ // releaseChosen is not available Check why?
//                                $alert({
//                                    title: "Success",
//                                    content: "User Story Edited",
//                                    placement: 'top',
//                                    container: '.modal-dialog'
//                                });
//                            }
//                            break;
//                        case "save":
//                            $alert({
//                                title: "Success",
//                                content: "User Story Edited",
//                                placement: 'top',
//                                container: '.modal-dialog'
//                            });
//                            break;
//                    }
//                })
//                .catch(function (response) {
//                    $alert({
//                        title: "Error fetching Rally domains",
//                        content: "There was an error fetching the list of Projects from the server.",
//                        placement: 'top',
//                        container: '.modal-dialog'
//                    });
//                });
//            };
        };

        //Function when the delete button is used
        $scope.deleteButton = function (){
            $scope.data.nodeID = $scope.content.node.id;
            $scope.data.children = $scope.content.node.children;
            $scope.data.name = $scope.content.node.text;

            if ($scope.data.children.length==0){
                var deleteModal = $modal({
                    templateUrl: 'angular/rally/_deleteModal.html',
                    animation:'am-flip-x',
                    title:'Delete Confirmation',
                    content:'Are you sure you want to delete "'+$scope.content.node.text +'"?',
                    controller:'rallyDeleteModalCtrl',
                    resolve:{
                       node:function(){return $scope.content.node;}
                    },
                    show: true
                });
            }
            else{
                $alert({
                    title: "Invalid Delete",
                    content: "Cannot be deleted because user story has children",
                    placement: 'top',
                    container: '.alert-modal',
                    type: 'danger'
                }).show();
            }

        };
    }
})();
