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
        .controller('rallyController', rallyController)
        .controller('rallyTree', rallyTree)
        .controller('rallyPopoverCtrl', rallyPopoverCtrl);

    rallyController.$inject = ['$scope', 'rallyDataService', 'errorService'];
    /**
     * Controller for the modal to search and add requirements
     */
    function rallyController($scope, rallyDataService) {
        var vm = this; 
        $scope.data = {};
        
        $scope.PopoverId = "popover.html";
        
        $scope.$on("RallySettingChanged", function (event, data){
            $scope.SelectedProject = data.project; 
            $scope.SelectedRelease = data.release;
//            console.log("Selected Project", $scope.SelectedProject);
//            console.log("Selected Release", $scope.SelectedRelease);
//            console.log("RallyChanged", data.project);
            $scope.getIteration(data.project);
            $scope.$broadcast("RallyLoadTree", $scope.data);
        });
        
        $scope.$on("RallyResponseHandle", function (event, data){
            $scope.$emit("Alert", {
                title: "Rally Backend Service Alert",
                content: "Backend Service Error!",
            });
        });
        
        $scope.RallyIterationChange = function (){
            $scope.$broadcast("RallyLoadTree", $scope.data);
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
    
    rallyTree.$inject = ['$scope', 'rallyDataService', '$alert', '$log', 'errorService', 'rallyDataSet']; // $scope, rallyDataService, rallyDataSet, $alert, $log
    
    function rallyTree($scope, rallyDataService, rallyDataSet, $alert, $log, settings){
        
        var vm = this;
        
        $scope.data = {};
        $scope.undoArray = [];
        
        $scope.$on("RallyLoadTree", function (event, data){
            $scope.getTreeData($scope.data);
        });
        
        //Function to request tree data
        $scope.getTreeData = function (data) {
            $scope.$emit("RallyLoad");
            rallyDataService.RallyData.treeData({project: $scope.SelectedProject, release: $scope.SelectedRelease}).$promise
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
    
    rallyPopoverCtrl.$inject = ['$scope', 'rallyDataService', 'rallyDataSet', '$modal', '$alert', '$sce']; //
    
    function rallyPopoverCtrl($scope, rallyDataService, rallyDataSet, $modal, $alert, $sce,$settings){
        
        var vm = this;
        $scope.data = {};
        
        //Function when the add button is used
       $scope.addButton = function (){
            $scope.data.newNodeID = rallyDataSet.selectedNode.nodeID;
            $scope.newNode = {owner: $scope.data.specificOwner, release: $scope.data.releaseChosen, state: "Defined"};
            rallyDataService.releases.releaseList({input: $scope.SelectedProject}).$promise
                .then(function (val, response) {                        
                    $scope.data.releaseList = val.data;
                    var noAllRelease = $scope.data.releaseList.indexOf('all');
                    $scope.data.exactReleaseList = $scope.data.releaseList.slice(0);
                    $scope.data.exactReleaseList.splice(noAllRelease, 1);
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                });
            
            rallyDataService.iterations.IterationList({input: $scope.SelectedProject}).$promise
                .then(function (val, response) {
                    $scope.data.IterationList = val.data;
                    var noAllRelease = $scope.data.IterationList.indexOf('all');
                    $scope.data.exactIterationList = $scope.data.iterationList.slice(0);
                    $scope.data.exactIterationList.splice(noAllRelease, 1);
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                });
            
            var addModal = $modal({
                templateUrl: 'angular/rally/_addForm.html',
                animation:'am-flip-x',
                show: true
            });
            
            $scope.submit = function (submitType){
                rallyDataService.RallyDataCreate.AddNode({
                    project: $scope.data.projectChosen,
                    title: $scope.data.newNode.title,
                    owner: $scope.data.newNode.owner,
                    state: $scope.data.newNode.state,
                    release: $scope.data.newNode.release,
                    points: $scope.data.newNode.points,
                    iteration: $scope.data.newNode.iteration,
                    description: $scope.data.newNode.description,
                    newNodeID: $scope.data.newNodeID,
                    arch: $scope.data.newNode.arch
                }).$promise
                .then(function (val, response) {
                    if ($scope.data.newNode.release == $scope.data.releaseChosen){
                        rallyDataSet.actionNode = $scope.data.newNode;
                        rallyDataSet.RallyDataCreate.AddNode.nodeID = val.data.ID;
                        rallyDataSet.RallyDataCreate.AddNode.name = $scope.newNode.title;
                        rallyDataSet.RallyDataCreate.AddNode.archID = $scope.newNode.arch;
                        rallyDataSet.RallyDataCreate.AddNode.iteration = $scope.newNode.iteration;
                        rallyDataSet.RallyDataCreate.AddNode.icon = val.data.icon;
                        rallyDataSet.RallyDataCreate.AddNode.blocked = val.data.Blocked;
                    }
                    switch (submitType){
                        case "close":
                            $(addModal).modal('hide');
                            break;
                        case "new":
                            $scope.data.newNode.title = null;
                            $scope.data.newNode.state = null;
                            $scope.data.newNode.points = null;
                            $scope.data.newNode.iteration = null;
                            $scope.data.newNode.arch = null;
                            $scope.data.newNode.description = '';
                            break;
                    }
                    $alert({
                        title: 'User story added under Release: ' + $scope.data.newNode.release,
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
            
        };
        
        //Function when the info button is used
        $scope.infoButton = function (){
            $scope.data.nodeID = rallyDataSet.selectedNode.nodeID;
            $scope.load = true;
            $scope.noPoints = false;
            
            rallyDataService.RallyDataDetails.metadata({input: $scope.data.nodeID}).$promise
                .then(function (val, response) {
                    $scope.data.modalData = val.data;
                    $scope.data.modalData.description = $sce.trustAsHtml(val.data.description);
                    var myModal = $modal({
                        contentTemplate: 'angular/rally_modal.html',
                        scope: $scope.data,
                        show: true
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
                
            rallyDataService.RallyDataDetails.EQI({input: $scope.data.nodeID}).$promise
                .then(function (val, response) {
                    $scope.noPoints = false;
                    $scope.data.eqiData = val.data;
                    $scope.data.percentage = 100 * $scope.data.eqiData.Accepted / $scope.data.eqiData.Planned;
                    $scope.load = false;
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
         
        //Function when the edit button is used
        $scope.editButton = function (){
            
            $scope.data.nodeID = rallyDataSet.selectedNode.nodeID;
            $scope.data.children = rallyDataSet.selectedNode.children;
            
            var noAll = $scope.data.releaseList.indexOf('All');
            $scope.data.exactReleaseList = $scope.data.releaseList.slice(0);
            $scope.data.exactReleaseList.splice(noAll, 1);
            $scope.data.exactIterationList = $scope.data.iterationList.slice(0);
            $scope.data.exactIterationList.pop();
            
            if ($scope.data.children){
                $scope.data.parent = true;
            }
            else{
                $scope.data.parent = false;
            }
            
            rallyDataService.RallyDataDetails.metadata({input: $scope.data.nodeID}).$promise
                .then(function (val, response) {
                    $scope.data.editData = val.data;
                    $scope.data.staticTitle = val.data.Title;
                    $scope.data.staticArch = val.data.arch;
                    $scope.data.staticState = val.data.state;
                    $scope.data.staticIteration = val.data.iteration;
                    $scope.data.editData.description = val.data.description;
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                });
                
            var editModal = $modal({
                    contentTemplate: 'angular/rally/_editForm.html',
                    scope: $scope.data,
                    show: true
                });
                
            $scope.esubmit = function (esubmitType){
                rallyDataService.RallyDataUpdate.updateNode({
                    project: $scope.data.projectChosen,
                    title: $scope.data.editData.Title,
                    owner: $scope.data.editData.owner,
                    points: $scope.data.editData.points,
                    state: $scope.data.editData.state,
                    release: $scope.data.editData.release,
                    iteration: $scope.data.editData.iteration,
                    description: $scope.data.editData.description,
                    newNodeID: $scope.data.nodeID,
                    arch: $scope.data.editData.arch
                }).$promise
                .then(function (val, response) {
                    if ($scope.data.editData.release !== $scope.data.releaseChosen && !$scope.data.children && ($scope.data.releaseChosen !== 'All')){
                        rallyDataSet.actionNode = $scope.data.nodeID;
                        rallyDataSet.deleteSuccess = true;
                        $alert({
                            title: "Success",
                            content: 'User story located in Release: ' + $scope.data.editData.release,
                            placement: 'top',
                            container: '.modal-dialog'
                        });
                    }
                    if ($scope.data.editData.Title !== $scope.data.staticTitle || $scope.data.editData.iteration !== $scope.data.staticIteration ||
                            $scope.data.editData.state !== $scope.data.staticState || $scope.data.editData.arch !== $scope.data.staticArch){
                        rallyDataSet.actionNode = $scope.data.nodeID;
                        rallyDataSet.editInfo.nodeID = $scope.data.nodeID;
                        rallyDataSet.editInfo.name = $scope.data.editData.Title;
                        rallyDataSet.editInfo.archID = $scope.data.editData.arch;
                        rallyDataSet.editInfo.iteration = $scope.data.editData.iteration;
                        rallyDataSet.editInfo.icon = val.data.icon;
                        rallyDataSet.editInfo.blocked = val.data.Blocked;
                        
                    }
                    switch (esubmitType){
                        case "close":
                            $(editModal).modal('hide');
                            if ($scope.data.editData.release == $scope.data.releaseChosen){ // releaseChosen is not available Check why?
                                $alert({
                                    title: "Success",
                                    content: "User Story Edited",
                                    placement: 'top',
                                    container: '.modal-dialog'
                                });
                            }
                            break;
                        case "save":
                            $alert({
                                title: "Success",
                                content: "User Story Edited",
                                placement: 'top',
                                container: '.modal-dialog'
                            });
                            break;
                    }
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
        };
        
        //Function when the delete button is used
        $scope.deleteButton = function (){
            $scope.data.nodeID = rallyDataSet.selectedNode.nodeID;
            $scope.data.children = rallyDataSet.selectedNode.children;
            $scope.data.name = rallyDataSet.selectedNode.name;
            
            if (!$scope.data.children){
                var deleteModal = $modal({
                    contentTemplate: 'angular/rally/_deleteModal.html',
                    scope: $scope,
                    show: true
                });
            }
            else{
                $alert({
                    title: "Invalid Delete",
                    content: "Cannot be deleted because user story has children",
                    placement: 'top',
                    container: '.modal-dialog'
                });
            }
            
            $scope.deleteConfirm = function(){
                $(deleteModal).modal('hide');
                rallyDataService.RallyDataDelete.deleteNode({input: $scope.data.nodeID}).$promise
                .then(function (val, response) {
                    rallyDataSet.actionNode = $scope.data.nodeID;
                    rallyDataSet.deleteSuccess = true;
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
        };
    }
})();
