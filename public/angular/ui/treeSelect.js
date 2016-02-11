/*
 * Leon xu 
 * xinghuangxu@gmail.com
 * 
 * This tree select directive is currently being used in Test Strategy 'Impact Areas' and 'Test Variables' Field to select tags from a tree
 * TODO: replace this with the generic configuratble jstree: see multiArrangeJtree
 */
//JStree directive

(function () {
    'use strict';

    angular
            .module('spark.ui')
            .directive('sparkTreeSelect', sparkTreeSelect)
            .directive('selectJstree', selectJstree);

    sparkTreeSelect.inject = ['$templateCache', '$compile', 'tagService', 'errorService'];
    selectJstree.inject = ['$popover', '$templateCache', '$compile'];

    function sparkTreeSelect($templateCache, $compile, tagService, errorService)
    {
        return {
            restrict: 'EA',
            scope: {
                current: '=current'
            },
            templateUrl: 'angular/ui/partial/_treeSelect.html?v=0',
            link: function (scope, element, attrs) {
                //see if read only has been configured
                if (attrs.selectreadonly === "true") {
                    element.css("background-color", "rgb(238, 238, 238)");
                    element.find("button").attr("disabled", "true");
                }
                //enable collapsible window which contains the tree and tag management view.
                scope.toggleCollapse = function (e) {
                    element.find("#collapseTreeSelect").toggle("collapse");
                    e.stopPropagation();
                };
                //hide the select tree when user click on any other area in the test strategy editor
                scope.$on("SparkTreeSelectHide", function () {
                    if (element.find("#collapseTreeSelect:visible").length !== 0) {
                        element.find("#collapseTreeSelect").toggle("collapse");
                    }
                });
                //stop the click propagation so that the collapible window would not be closed by the above function
                element.find("#collapseTreeSelect").click(function (e) {
                    e.stopPropagation();
                });
                //keep track of all selected items
                scope.selectedItem = {
                };
                //container for the tags DOM elements
                var selectedItemContainer = $(element.find(".spark-tree-select-info")[0]);
                //add in tags to the input box correspond to user selected tree elements. Each tag has a close button attached to it.
                function updateSelectedItem() {
                    selectedItemContainer.empty();
                    var selectedObjs = scope.selectedItem;
                    for (var key in selectedObjs) {
                        key = parseInt(key);
                        if (selectedObjs.hasOwnProperty(key)) {
                            var span = $('<span />').attr('class', 'select-item').html(selectedObjs[key]["text"] + '<button data="' + selectedObjs[key]["id"] + '" id="btn-' + selectedObjs[key]["id"] + '" type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-remove" aria-hidden="true"></button>');
                            selectedItemContainer.append(span);
                            selectedItemContainer.find('#btn-' + selectedObjs[key]["id"]).click(function () {
                                $(this).parent().remove();
                                scope.$broadcast("RemoveSelectedItem", $(this).attr("data"));
                            });
                        }
                    }
                }
                
                scope.$watch('current',function(newValue, oldValue){
                   alert("Helo");
                });

                //traverse the elements in the tree to update the input box tags
                var allEle = {};
                scope.changeElement = function (d) {
                    var selected = d.selected;
                    scope.selectedItem = {};
                    for (var i = 0; i < selected.length; i++) {
                        scope.selectedItem[selected[i]] = allEle[selected[i]];
                    }
                    updateSelectedItem();
                };

                tagService.impact().$promise
                        .then(function (data) {
                            scope.tree = buildTree(data, 3);
                            var tree = scope.tree;
                            for (var i = 0; i < tree.length; i++) {
                                allEle[tree[i]["id"]] = tree[i];
                            }
                        })
                        .catch(function (error) {
                            errorService.error(error);
                        });
                //TODO: replace testing data with actual backend tag services. 
//                scope.tree = [
//                    {"id": 1, "parent": "#", "text": "Features", "icon": ""},
//                    {"id": 2, "parent": "1", "text": "ARVM", "icon": ""},
//                    {"id": 3, "parent": "1", "text": "Snapshot", "icon": ""},
//                    {"id": 4, "parent": "1", "text": "Volumn Cop", "icon": ""},
//                    {"id": 5, "parent": "1", "text": "DSS", "icon": ""},
//                    {"id": 6, "parent": "1", "text": "DRM", "icon": ""},
//                    {"id": 7, "parent": "#", "text": "Hardware", "icon": ""},
//                    {"id": 8, "parent": "#", "text": "Plugins", "icon": ""},
//                ];

            }
        };
    };

    /**
     * Un-flatten tag array into a tree
     * 
     * @param {array} tagsArray List of tags to transform
     * 
     * @return {object|array} Tree representation of the list 
     */
    function buildTree(tagsArray, slice) {
        var result = [];
        var keyList = {};
        for (var i = 0; i < tagsArray.length; i++) {
            if (tagsArray[i]['IsActive'] === "1") {
                keyList[tagsArray[i]['CategoryID']] = true;
            }
        }
        for (var i = 0; i < tagsArray.length; i++) {
            if (tagsArray[i]['IsActive'] === "1") {
                var single = {};
                single.id = tagsArray[i]['CategoryID'];
                single.text = tagsArray[i]['CategoryName'];
                if (keyList[tagsArray[i]['CategoryFatherID']]) {
                    single.parent = tagsArray[i]['CategoryFatherID'];
                } else {
                    single.parent = "#";
                }
                single.icon = "";
//                single.state = {selected: true};
                result.push(single);
            }
        }
        return result;
    }

    function selectJstree($popover, $templateCache, $compile)
    {
        return {
            restrict: "EA",
            require: ["ngModel"],
            //In-Progress: This should be an isolated scope directive for better angular practice
            //scope: {ngModel: '='},
            link: function (scope, element, attrs) {
                //local filter when treeSearch variable get changed
                scope.$watch('treeSearch', function (newValue, oldValue) {
                    if (element.jstree(true)) {
                        element.jstree(true).search(newValue);
                    }
                });
                //when remove tag from the input box should uncheck the node in the tree
                scope.$on("RemoveSelectedItem", function (event, data) {
                    element.jstree("uncheck_node", data);
                });
                //TODO: replace this with the generic configuratble jstree: see multiArrangeJtree
                scope.$watch(attrs.ngModel, function ()
                {

                    //Destroys last instance of jstree so a new one can be created. Ideally jstree refresh should be used, but functionality of refresh has not worked
                    element.jstree("destroy");
                    element.bind("changed.jstree", function (e, d) {
                        //execute code when the jstree changed:user select or unselect tree nodes
                        scope.changeElement(d); //update the information in the input field
                    });
                    //jstree initialization with checkbox!
                    element.jstree(
                            {
                                //"state" plugin currently disabled since it does not work alongside our select node function
                                plugins: ["themes", "search", "dnd", "crrm", "ui", "checkbox"],
                                search: {
                                    "case_sensitive": false,
                                    //only displays matches found in search bar
                                    "show_only_matches": true,
                                    //fuzzy set to false so search looks for exact matches
                                    "fuzzy": false
                                },
                                core: {
                                    multiple: true,
                                    themes: {
                                        "theme": "default",
                                        "icons": true,
                                        "dots": false
                                    },
                                    //Allows for nodes to be dragged
                                    check_callback: function (operation, node, node_parent, node_position, more) {

                                        if (operation == "delete_node" && !scope.authentication.deleteSuccess && !scope.authentication.editRelease) {
                                            return false;
                                        } else if (operation == "copy_node") { //Temporary fix for Ctrl functionality when user story is in the process of being dragged. (Prevents copy feature)
                                            return false;
                                        } else {
                                            return scope.editEnable();
                                        }
                                    },
                                    data: scope[attrs.ngModel]
                                }
                            }
                    );
                }, true);
            }
        };
    }
    ;
})();
