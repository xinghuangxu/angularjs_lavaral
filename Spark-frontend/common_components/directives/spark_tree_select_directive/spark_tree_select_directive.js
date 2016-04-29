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
            .module('commonComponents')
            .directive('sparkTreeSelect', sparkTreeSelect);

    sparkTreeSelect.inject = [];

    function sparkTreeSelect()
    {
        return {
            restrict: 'EA',
            scope: {
                treeData: '=',
                treeConfig:'='
            },
            templateUrl: 'common_components/directives/spark_tree_select_directive/partials/tree_select.html',
            link: function (scope, element, attrs) {

            },
            controller:treeSelectController,
            controllerAs:'treeSelectionCtrl'
        };
    }
    treeSelectController.$inject=['$popover','$scope'];
    function treeSelectController($popover,$scope){
        $scope.selectCallback = selectCallback;
        $scope.deselectCallback = deselectCallback;
        $scope.deleteNode = deleteNode;
        $scope.selected_nodes=[];
        var popover = {
            content:$scope,
            animation:"am-flip-x",
            placement:"bottom-left",
            trigger: 'manual',
            templateUrl:"common_components/directives/spark_tree_select_directive/partials/popover/popover.html",
            container:"body",
            autoClose:"1"
        };
        var myPopover = $popover(angular.element(document.querySelector('#treeSelectPopOverButton')), popover);

        $scope.togglePopover = function() {
            updateTreeData();
            myPopover.$promise.then(myPopover.toggle);
        };
        function updateTreeData(){
            for (var i=0; i<$scope.treeData.length;i++)
            {
                for(var j=0;j<$scope.selected_nodes.length;j++)
                {
                    if($scope.selected_nodes[j]==$scope.treeData[i])
                    {
                        $scope.treeData[i].class="jstree-clicked";
                    }
                }
            }
        }
        function selectCallback(arg){
            var node_id=arg.data.node.id;
            var node_name = arg.data.node.text;
            $scope.selected_nodes.push({id:node_id,name:node_name});
        }
        function deselectCallback(arg){
            console.log(arg);
            deleteNode(arg.data.node.id);
        }
        function deleteNode(node_id){
            for (var i=0;i<$scope.selected_nodes.length;i++)
            {
                if($scope.selected_nodes[i].id == node_id)
                {
                    $scope.selected_nodes.splice(i, 1);
                }
            }
        }


    }


})();
