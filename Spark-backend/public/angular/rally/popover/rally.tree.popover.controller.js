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
                templateUrl: 'angular/rally/modals/_addForm.html',
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
                templateUrl: 'angular/rally/modals/_infoModal.html',
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
                templateUrl: 'angular/rally/modals/_editForm.html',
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


        //Function when the delete button is used
        $scope.deleteButton = function (){
            $scope.data.nodeID = $scope.content.node.id;
            $scope.data.children = $scope.content.node.children;
            $scope.data.name = $scope.content.node.text;

            if ($scope.data.children.length==0){
                var deleteModal = $modal({
                    templateUrl: 'angular/rally/modals/_deleteModal.html',
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
}})();
