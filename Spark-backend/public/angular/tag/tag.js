/**
 * Controllers for tag selection
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-08
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.tag')
        .controller('AddTag', AddTag);

    AddTag.inject = ['$scope', 'tagService', 'errorService'];
    /**
     * Controller for the modal to search and add tags
     */
    function AddTag($scope, tagService, errorService) {
        var vm = this;
        
        vm.classes = 'modal-narrow';
        vm.treeConfig = {
            core: {
                multiple: $scope.multi || false 
            },
            search: {
                show_only_matches: true
            }
        };
        
        activate();
        
        /**
         * Initialize the controller and load data
         */
        function activate() {
            var service;
            
            switch($scope.tagType) {
                case 'qual':
                    vm.type = " Qualification Area";
                    vm.slice = 3;
                    service = tagService.qual;
                    break;
                case 'impact':
                default:
                    vm.type = " Impact Area";
                    vm.slice = 2;
                    service = tagService.impact;
                    break;
            }
            
            service().$promise
                .then(function(data) {
                    vm.tags = buildTree(data, vm.slice);
                })
                .catch(function(error) {
                    errorService.error(error);
                });
        }
        
        /**
         * Un-flatten tag array into a tree
         * 
         * @param {array} tagsArray List of tags to transform
         * 
         * @return {object|array} Tree representation of the list 
         */
        function buildTree(tagsArray, slice) {
            var root = {
                children: []
            }
            angular.forEach(tagsArray, function(val, key) {
                var pathElems = val.CategoryPath.split('\\');
                // Remove the first elements from the path (generally Root\Feature or Root\Default\Qualification Area)
                pathElems = pathElems.slice(slice);
                
                attachToParent(root, pathElems, val);
            });
            
            return root.children;
        }
        
        /**
         * Attach a node to the tree
         * 
         * Called recursively to search for parent nodes and rebuild the
         * tree from a flat array of data
         * 
         * @param {object} root Node to begin search from
         * @param {array} path List of path segments left to search through
         * @param {object} obj Object to add
         * 
         * @return {object} Node that the object was attached to
         */
        function attachToParent(root, path, obj) {
            if(path.length === 0) {
                var node = {
                    text: obj.CategoryName,
                    data: obj
                };
                
                // At the leaf; set the values and return
                if(!Array.isArray(root.children)){
                    root.children = [node]
                } else {
                    // Handle updating parent nodes which appear later than their children
                    var newChild = true;
                    angular.forEach(root.children, function(val, key) {
                        if(val.data.CategoryName === obj.CategoryName) {
                            newChild = false;
                            angular.extend(val.data, obj);
                        }
                    });
                    
                    if(newChild) {
                        root.children.push(node);
                    }
                }
                root.icon = 'glyphicon glyphicon-folder-open';
                return root;
            } else if(path.length === 1 && obj.CategoryName === '') {
                // Special leaf case -> no category name -> replace with last 'parent' in the path chain
                obj.CategoryName = path[0];
                obj.CategoryPath = obj.CategoryPath.replace(/\/[^\/]*/, "");
                
                var node = {
                    text: obj.CategoryName,
                    data: obj
                };
                
                if(!Array.isArray(root.children)){
                    root.children = [node]
                } else {
                    // Handle updating parent nodes which appear later than their children
                    var newChild = true;
                    angular.forEach(root.children, function(val, key) {
                        if(val.data.CategoryName === obj.CategoryName) {
                            newChild = false;
                            angular.extend(val.data, obj);
                        }
                    });
                    
                    if(newChild) {
                        root.children.push(node);
                    }
                }
                root.icon = 'glyphicon glyphicon-folder-open';
                return root;
            } else {
                var parent;
                angular.forEach(root.children, function(val, key) {
                    if(val.data.CategoryName === path[0]) {
                        parent = val;
                    }
                });
                
                if(!parent) {
                    var parent = {
                        text: path[0],
                        data: {
                            CategoryName: path[0],
                        },
                        children: []
                    };
                    
                    if(!Array.isArray(root.children)) {
                        root.children = [];
                    }
                    
                    root.children.push(parent);
                }
                
                return attachToParent(parent, path.slice(1), obj);
            }
        }
        
    }
})();
