(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.rally')
        .controller('rallyDeleteModalCtrl', rallyDeleteModalCtrl);

     rallyDeleteModalCtrl.$inject = ['$scope','$alert','rallyDataService','node','rallyDataSet'];
     function rallyDeleteModalCtrl($scope,$alert,rallyDataService,node,rallyDataSet){


            $scope.deleteConfirm = function(){

                rallyDataService.RallyDataDelete.deleteNode({input: node.id}).$promise
                .then(function (val, response) {
//                    rallyDataSet.actionNode = $scope.data.nodeID;
//                    rallyDataSet.deleteSuccess = true;
                    $alert({
                        title: "Success",
                        content: "Node Deleted",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
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


     }})();
