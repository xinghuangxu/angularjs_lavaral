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


    rallyTreeCtrl.$inject = ['$scope', 'rallyDataService', '$alert', '$log', 'errorService', 'rallyDataSet']; // $scope, rallyDataService, rallyDataSet, $alert, $log

    function rallyTreeCtrl($scope, rallyDataService, rallyDataSet, $alert, $log, settings){

        var vm = this;

        $scope.data = {};
        $scope.undoArray = [];

        $scope.$on("RallyLoadTree", function (event, data){
            $scope.data = data;
            $scope.getTreeData($scope.data);
        });

        //Function to request tree data
        $scope.getTreeData = function (data) {
            $scope.$emit("RallyLoad");
            rallyDataService.RallyData.treeData({project: data.SelectedProject, release: data.SelectedRelease}).$promise
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

        //Function to move a node
        $scope.moveNode = function (data){
            var moveNodeData = {node: data.node, parent: data.parent};
            rallyDataService.RallyDataDragDrop.dragdrop({input: moveNodeData}).$promise
                .then(function (val, response) {
                    var undoNodeData = {
                        input: {node: data.node, parent: data.oldParent},
                        input_type: 'dragdrop',
                        position: data.oldPosition
                    };
                    $scope.undoArray.push(undoNodeData);
                    $alert({
                        title: "Success",
                        content: "User Story Moved",
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

        //Function that currently undos any move node action. Note: This function is compatible to add add/delete undo functions in the future
        // this function doesn't have backendpoint yet
        $scope.undoAction = function () {
            $scope.undoData = $scope.undoArray.pop();
            rallyDataService.RallyData.treeData().$promise
                .then(function (val, response) {
                    delete $scope.undoData;
                    $alert({
                        title: "Success",
                        content: "Move Undone",
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

        //Function to deliver the edit enable checkbox value to the jstree directive
        $scope.editEnable = function () {
        };

        //Function to store selected jstree node information
        $scope.storeNode = function (data){
            rallyDataSet.selectedNode.nodeID = $scope.data.nodeID;
            rallyDataSet.selectedNode.children = $scope.data.children;
            rallyDataSet.selectedNode.name = $scope.data.name;
        };

        //Function to confirm a successful delete.
        $scope.deleteNode = function (){
            rallyDataSet.deleteSuccess = false;
        };

        $scope.nullEditInfo = function (){
            rallyDataSet.actionNode = null;
            rallyDataSet.editInfo.nodeID = null;
            rallyDataSet.actionNode = null;
            rallyDataSet.editInfo.nodeID = null;
            rallyDataSet.editInfo.name = null;
            rallyDataSet.editInfo.archID = null;
            rallyDataSet.editInfo.iteration = null;
            rallyDataSet.editInfo.icon = null;
            rallyDataSet.editInfo.blocked = null;
        };
    }
})();
