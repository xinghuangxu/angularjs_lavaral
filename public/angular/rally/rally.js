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
        vm.data = {}; 
        
        vm.PopoverId = "popover.html";
        
        $scope.$on("RallySettingChanged", function (event, data){
            $scope.SelectedProject = data.project; 
            $scope.SelectedRelease = data.release;
//            console.log("Selected Project", $scope.SelectedProject);
//            console.log("Selected Release", $scope.SelectedRelease);
//            console.log("RallyChanged", data.project);
            vm.getIteration(data.project);
            $scope.$broadcast("RallyLoadTree", vm.data);
        });
        
        $scope.$on("RallyResponseHandle", function (event, data){
            $scope.$emit("Alert", {
                title: "Rally Backend Service Alert",
                content: "Backend Service Error!",
            });
        });
        
        $scope.RallyIterationChange = function (){
            $scope.$broadcast("RallyLoadTree", vm.data);
        };
        
        vm.getIteration = function (project){
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
        
        vm.data = {}; 
        vm.undoArray = []; 
        
        $scope.$on("RallyLoadTree", function (event, data){
            vm.getTreeData(vm.data);
        });
        
        //Function to request tree data
        vm.getTreeData = function (data) {
            $scope.$emit("RallyLoad");
            rallyDataService.RallyData.treeData({project: $scope.SelectedProject, release: $scope.SelectedRelease}).$promise
                .then(function (val, response) {
//                    console.log("TreeData: ", val.data);
                    $scope.tree = val.data; 
                    vm.undoArray = [];
                    vm.load = false;
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
        vm.moveNode = function (data){
            var moveNodeData = {node: data.node, parent: data.parent};
            rallyDataService.RallyDataDragDrop.dragdrop({input: moveNodeData}).$promise
                .then(function (val, response) {
                    var undoNodeData = {
                        input: {node: data.node, parent: data.oldParent},
                        input_type: 'dragdrop',
                        position: data.oldPosition
                    };
                    vm.undoArray.push(undoNodeData);
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
        vm.undoAction = function () {
            vm.undoData = vm.undoArray.pop();
            rallyDataService.RallyData.treeData().$promise
                .then(function (val, response) {
                    delete vm.undoData;
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
        vm.editEnable = function () {
        };
        
        //Function to store selected jstree node information
        vm.storeNode = function (data){
            rallyDataSet.selectedNode.nodeID = vm.data.nodeID;
            rallyDataSet.selectedNode.children = vm.data.children;
            rallyDataSet.selectedNode.name = vm.data.name;
        };
        
        //Function to confirm a successful delete.
        vm.deleteNode = function (){
            rallyDataSet.deleteSuccess = false;
        };
        
        vm.nullEditInfo = function (){
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
    
    function rallyPopoverCtrl($scope, rallyDataService, rallyDataSet, $modal, $alert, $sce, settings){
        
        var vm = this;
        vm.data = settings.data;
        
        //Function when the add button is used
        vm.addButton = function (){
            vm.data.newNodeID = rallyDataSet.selectedNode.nodeID;
            vm.newNode = {owner: vm.data.specificOwner, release: vm.data.releaseChosen, state: "Defined"};
            rallyDataService.releases.releaseList({input: vm.data.project}).$promise
                .then(function (val, response) {                        
                    vm.data.releaseList = val.data;
                    var noAllRelease = vm.data.releaseList.indexOf('all');
                    vm.data.exactReleaseList = vm.data.releaseList.slice(0); 
                    vm.data.exactReleaseList.splice(noAllRelease, 1);
                })
                .catch(function (response) {
                    $alert({
                        title: "Error fetching Rally domains",
                        content: "There was an error fetching the list of Projects from the server.",
                        placement: 'top',
                        container: '.modal-dialog'
                    });
                });
            
            rallyDataService.iterations.IterationList({input: vm.data.project}).$promise
                .then(function (val, response) {
                    vm.data.IterationList = val.data;
                    var noAllRelease = vm.data.IterationList.indexOf('all');
                    vm.data.exactIterationList = vm.data.iterationList.slice(0); 
                    vm.data.exactIterationList.splice(noAllRelease, 1);
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
                contentTemplate: 'angular/rally/_addForm.html',
                scope: vm,
                show: true
            });
            
            vm.submit = function (submitType){
                rallyDataService.RallyDataCreate.AddNode({
                    project: vm.data.projectChosen,
                    title: vm.data.newNode.title,
                    owner: vm.data.newNode.owner,
                    state: vm.data.newNode.state,
                    release: vm.data.newNode.release,
                    points: vm.data.newNode.points,
                    iteration: vm.data.newNode.iteration,
                    description: vm.data.newNode.description,
                    newNodeID: vm.data.newNodeID,
                    arch: vm.data.newNode.arch
                }).$promise
                .then(function (val, response) {
                    if (vm.data.newNode.release == vm.data.releaseChosen){
                        rallyDataSet.actionNode = vm.data.newNode;
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
                            vm.data.newNode.title = null;
                            vm.data.newNode.state = null;
                            vm.data.newNode.points = null;
                            vm.data.newNode.iteration = null;
                            vm.data.newNode.arch = null;
                            vm.data.newNode.description = '';
                            break;
                    }
                    $alert({
                        title: 'User story added under Release: ' + vm.data.newNode.release,
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
        vm.infoButton = function (){
            vm.data.nodeID = rallyDataSet.selectedNode.nodeID;
            vm.load = true; 
            vm.noPoints = false;
            
            rallyDataService.RallyDataDetails.metadata({input: vm.data.nodeID}).$promise
                .then(function (val, response) {
                    vm.data.modalData = val.data;
                    vm.data.modalData.description = $sce.trustAsHtml(val.data.description);
                    var myModal = $modal({
                        contentTemplate: 'angular/rally_modal.html',
                        scope: vm.data,
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
                
            rallyDataService.RallyDataDetails.EQI({input: vm.data.nodeID}).$promise
                .then(function (val, response) {
                    vm.noPoints = false; 
                    vm.data.eqiData = val.data; 
                    vm.data.percentage = 100 * vm.data.eqiData.Accepted / vm.data.eqiData.Planned;
                    vm.load = false;
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
        vm.editButton = function (){
            
            vm.data.nodeID = rallyDataSet.selectedNode.nodeID; 
            vm.data.children = rallyDataSet.selectedNode.children; 
            
            var noAll = vm.data.releaseList.indexOf('All');
            vm.data.exactReleaseList = vm.data.releaseList.slice(0);
            vm.data.exactReleaseList.splice(noAll, 1);
            vm.data.exactIterationList = vm.data.iterationList.slice(0);
            vm.data.exactIterationList.pop();
            
            if (vm.data.children){
                vm.data.parent = true;
            }
            else{
                vm.data.parent = false;
            }
            
            rallyDataService.RallyDataDetails.metadata({input: vm.data.nodeID}).$promise
                .then(function (val, response) {
                    vm.data.editData = val.data; 
                    vm.data.staticTitle = val.data.Title;
                    vm.data.staticArch = val.data.arch; 
                    vm.data.staticState = val.data.state; 
                    vm.data.staticIteration = val.data.iteration;
                    vm.data.editData.description = val.data.description;
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
                    scope: vm.data,
                    show: true
                });
                
            vm.esubmit = function (esubmitType){
                rallyDataService.RallyDataUpdate.updateNode({
                    project: vm.data.projectChosen,
                    title: vm.data.editData.Title,
                    owner: vm.data.editData.owner, 
                    points: vm.data.editData.points, 
                    state: vm.data.editData.state, 
                    release: vm.data.editData.release, 
                    iteration: vm.data.editData.iteration, 
                    description: vm.data.editData.description, 
                    newNodeID: vm.data.nodeID,
                    arch: vm.data.editData.arch
                }).$promise
                .then(function (val, response) {
                    if (vm.data.editData.release !== vm.data.releaseChosen && !vm.data.children && (vm.data.releaseChosen !== 'All')){ 
                        rallyDataSet.actionNode = vm.data.nodeID;
                        rallyDataSet.deleteSuccess = true;
                        $alert({
                            title: "Success",
                            content: 'User story located in Release: ' + vm.data.editData.release,
                            placement: 'top',
                            container: '.modal-dialog'
                        });
                    }
                    if (vm.data.editData.Title !== vm.data.staticTitle || vm.data.editData.iteration !== vm.data.staticIteration || 
                            vm.data.editData.state !== vm.data.staticState || vm.data.editData.arch !== vm.data.staticArch){
                        rallyDataSet.actionNode = vm.data.nodeID;
                        rallyDataSet.editInfo.nodeID = vm.data.nodeID;
                        rallyDataSet.editInfo.name = vm.data.editData.Title;
                        rallyDataSet.editInfo.archID = vm.data.editData.arch;
                        rallyDataSet.editInfo.iteration = vm.data.editData.iteration;
                        rallyDataSet.editInfo.icon = val.data.icon;
                        rallyDataSet.editInfo.blocked = val.data.Blocked;
                        
                    }
                    switch (esubmitType){
                        case "close":
                            $(editModal).modal('hide');
                            if (vm.data.editData.release == vm.data.releaseChosen){ // releaseChosen is not available Check why? 
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
        vm.deleteButton = function (){
            vm.data.nodeID = rallyDataSet.selectedNode.nodeID; 
            vm.data.children = rallyDataSet.selectedNode.children;
            vm.data.name = rallyDataSet.selectedNode.name; 
            
            if (!vm.data.children){
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
            
            vm.deleteConfirm = function(){
                $(deleteModal).modal('hide');
                rallyDataService.RallyDataDelete.deleteNode({input: vm.data.nodeID}).$promise
                .then(function (val, response) {
                    rallyDataSet.actionNode = vm.data.nodeID;
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
