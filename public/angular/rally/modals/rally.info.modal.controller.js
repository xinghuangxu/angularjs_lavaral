(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.rally')
        .controller('rallyInfoModalCtrl',  rallyInfoModalCtrl);

     rallyInfoModalCtrl.$inject = ['$scope', 'infoModalData'];
     function  rallyInfoModalCtrl($scope,infoModalData){


                      $scope.infoNode={

                    nodeTitle:infoModalData.data.Title,
                    selectedOwner:infoModalData.data.owner,
                    selectedState:infoModalData.data.state,
                    selectedRelease:infoModalData.data.release,
                    selectedPoint:infoModalData.data.points,
                    selectedIteration:infoModalData.data.Iteration?
                    infoModalData.data.Iteration._refObjectName:null,
                    description:infoModalData.data.description,
                    nodeID:infoModalData.data.id,
                    architecturalTopicId:infoModalData.data.arch



                    };




     }})();
