/**
 * JSTree component directive
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

 (function() {
     'use strict';

     angular
         .module('spark.rally')
         .directive("jstree", jstree)
         .directive("rally", rally);

     /**
      * Directive for handling jsTree elements in Angular
      *
      * @return {object} Directive instance for Angular to work with
      */
     jstree.$inject = ['$popover', '$templateCache', '$compile', 'rallyDataSet'];
     
     function jstree($popover, $templateCache, $compile, rallyDataSet){
        return {
            restrict: "EA",
            require: ["ngModel"],
            //In-Progress: This is an isolated $scope that we want to implement in the future for better angular practice
            //$scope: {ngModel: '='},

            link: function ($scope, element, attrs) {
                //When this flag is true, the move_node event is skipped
                var undoFlag = false;

                $scope.$watch(attrs.addFlag, function ()
                {
                    if (rallyDataSet.addNode.nodeID) {
                        var editState = $scope.editEnable();
                        $scope.enabled = true;

                        var nodeObj = element.jstree(true).get_node(rallyDataSet.actionNode);
                        element.jstree(true).open_node(rallyDataSet.actionNode);
                        element.jstree(true).create_node(nodeObj, {id: rallyDataSet.addNode.nodeID, TopicID: rallyDataSet.addNode.archID, parent: rallyDataSet.actionNode, text: rallyDataSet.addNode.name, Iteration: rallyDataSet.addNode.iteration, icon: rallyDataSet.addNode.icon, Blocked: rallyDataSet.addNode.blocked}, false, false);
                        console.log("Parent Node: ", nodeObj);
                        console.log("new Node: ", element.jstree(true).get_node(rallyDataSet.addNode.nodeID));
                        element.jstree(true).open_node(nodeObj);

                        $scope.enabled = editState;
                    }
                });

                $scope.$watch(attrs.editFlag, function ()
                {
                    if (rallyDataSet.editInfo.nodeID) {
                        var editState = $scope.editEnable();
                        $scope.enabled = true;

                        nodeObj = element.jstree(true).get_node(rallyDataSet.actionNode);
                        Child = element.jstree(true).get_node(nodeObj.children);
                        ChildrenArray = [];
                        while (element.jstree(true).is_parent(Child)) {
                            SubChild = element.jstree(true).get_node(Child.children);
                            //console.log("Child", Child.text, "Sub Child", SubChild.text);
                            ChildrenArray.push({"id": Child.id, "text": Child.text, "icon": Child.icon, "children": [{"id": SubChild.id, "text": SubChild.text, "icon": SubChild.icon}]});
                            Child = SubChild;
                        }
                        if (element.jstree(true).is_leaf(Child) & ChildrenArray.length === 0) {
                            ChildrenArray.push({"id": Child.id, "text": Child.text, "icon": Child.icon});
                        }
                        element.jstree(true).open_node(rallyDataSet.actionNode);
                        element.jstree(true).create_node(nodeObj, {
                            id: rallyDataSet.editInfo.nodeID,
                            TopicID: rallyDataSet.editInfo.archID,
                            parent: rallyDataSet.actionNode,
                            text: rallyDataSet.editInfo.name,
                            Iteration: rallyDataSet.editInfo.iteration,
                            icon: rallyDataSet.editInfo.icon,
                            Blocked: rallyDataSet.editInfo.blocked,
                            children: ChildrenArray}, false, false);

                        console.log("Parent Node: ", nodeObj);
                        console.log("new Node: ", element.jstree(true).get_node(rallyDataSet.editInfo.nodeID));
                        element.jstree(true).open_node(nodeObj);
                        $scope.nullEditInfo();

                        $scope.enabled = editState;
                    }
                });

                $scope.$watch(attrs.deleteFlag, function ()
                {
                    if (rallyDataSet.deleteSuccess) {
                        //editState saves the current state of the edit Enable checkbox. This block of code allows the delete to occur even if the edit enable checkbox is unchecked.
                        editState = $scope.editEnable();
                        $scope.enabled = true;

                        element.jstree("delete_node", element.jstree(true).get_node(rallyDataSet.actionNode));
                        $scope.deleteNode();
                        //Disabled: Desired method, however another $digest is already running during this call therefore creating an error. Will be fixed or re-evaluated in the future
                        //$scope.$apply(attrs.deleteNode);

                        //Reset the checkbox variable to it's previous state
                        $scope.enabled = editState;
                    }
                });

                $scope.$watch(attrs.undo, function ()
                {
                    if ($scope.undoData) {
                        //editState saves the current state of the edit Enable checkbox. This block of code allows the move to occur even if the edit enable checkbox is unchecked.
                        editState = $scope.editEnable();
                        $scope.enabled = true;

                        undoFlag = true;
                        element.jstree(true).move_node($scope.undoData.input.node, $scope.undoData.input.parent, $scope.undoData.position);

                        //Reset the checkbox variable to it's previous state
                        $scope.enabled = editState;
                    }

                }, true);
                
                $scope.$on('UniversalSearchEvent',function(event,data){
                    $scope.treeSearch=data;
                });
                $scope.$watch('treeSearch', function (newValue, oldValue) {
                    if(element.jstree(true)){
                         element.jstree(true).search(newValue);
                    }
                });

                $scope.$watch(attrs.ngModel, function ()
                {
//                    var to = false;
//                    $('#treeSearch').keyup(function () {
//                        if (to) {
//                            clearTimeout(to);
//                        }
//                        to = setTimeout(function () {
//                            var v = $('#treeSearch').val();
//                            element.jstree(true).search(v);
//                        }, 250);
//                    });

                    //Destroys last instance of jstree so a new one can be created. Ideally jstree refresh should be used, but functionality of refresh has not worked
                    element.jstree("destroy");
                    
                    //Event that fires when a node is moved
                    element.bind('move_node.jstree', function (e, data) {
                        console.log('Move Data: ', data);
                        //This sends information to the controller (to send to the back-end) if a node is moved (excluding re-ordering amongst siblings)
                        if (data.old_parent != data.parent && undoFlag == false) {
                            $scope.nodeInfo = {node: '', parent: '', oldParent: ''};
                            $scope.nodeInfo.node = data.node.id;
                            $scope.nodeInfo.parent = data.node.parent;
                            $scope.nodeInfo.oldParent = data.old_parent;
                            $scope.nodeInfo.oldPosition = data.old_position;
                            $scope.$apply(attrs.moveNode);
                            console.log($scope.nodeInfo);
                        } else {
                            undoFlag = false;
                        }

                    });




//                    //Loads the popover template
//                    var popoverContent = $templateCache.get($scope.PopoverId);
//                    //Gives the popover a controller
//                    var finalContent = $compile("<div>hello</div>")($scope);
//                    //Options of popover
//                    var options = {
//                        html: true,
//                        content:'content',
//                        title: false,
//                        placement: 'top',
//                        trigger: 'focus'
//                    };




                    
                    element.bind("select_node.jstree", function (element, data) {
//                        var target = $($(element.currentTarget).find('.jstree-clicked')[0]);
//                        console.log(data);
//                        //                        options['container']='.jstree-clicked';
//                        target.popover(options);
//                        target.popover("show");
//                        $scope.selectInfo = {nodeID: data.node.id, children: data.node.children.length, name: data.node.text};
//                        $scope.$apply(attrs.storeNode);
//                        //Disabled: This is a testing console log message
//                        console.log("Node ID: ", data.node.id);
                             var asAServiceOptions = {


    content:{project:$scope.data.SelectedProject,release:$scope.data.SelectedRelease,node:data.node},
    animation:'am-flip-x',
    placement:'top',
    trigger: 'manual',
    templateUrl:"angular/rally/_popover.html",
    autoClose:true
  }

                            var myPopover = $popover(angular.element($('#'+data.node.id)), asAServiceOptions);
                               myPopover.$promise.then(myPopover.toggle);

                    });
                    if($scope.Rally){
                        $scope.Rally.treeData=$scope[attrs.ngModel];
                    }
                    //jstree format setup
                    element.jstree(
                            {
                                //"state" plugin currently disabled since it does not work alongside our select node function
                                plugins: ["themes", "search", "dnd", "crrm", "ui"],
                                search: {
                                    "case_sensitive": false,
                                    //only displays matches found in search bar
                                    "show_only_matches": true,
                                    //fuzzy set to false so search looks for exact matches
                                    "fuzzy": false
                                },
                                core: {
                                    multiple: false,
                                    themes: {
                                        "theme": "default",
                                        "icons": true,
                                        "dots": false
                                    },
                                    //Allows for nodes to be dragged
                                    check_callback: function (operation, node, node_parent, node_position, more) {
                                        /*console.log("op1: ", operation);
                                         console.log('node1: ', node);
                                         console.log('par1: ', node_parent);
                                         console.log('pos1: ', node_position);
                                         console.log('more1: ', more);
                                         console.log('----------------------------------------------------------------------------------------------');*/
                                        if (operation == "delete_node" && !rallyDataSet.deleteSuccess && !rallyDataSet.editRelease) {
                                            return false;
                                        } else if (operation == "copy_node") { //Temporary fix for Ctrl functionality when user story is in the process of being dragged. (Prevents copy feature)
                                            return false;
                                        } else {
                                            return $scope.editEnable();
                                        }
                                    },
                                    data: $scope[attrs.ngModel]
                                }
                            }
                    );

                }, true);

            }

        };
     }
     
     
     function rally(){
         return {
                restrict: 'E',
                controller: "rallyController",
                templateUrl: 'angular/rally/_rally.html',
                link: function ($scope, element, attrs) {
                }
            };
     }

 })();
