/*
 * xinghuangxu@gmail.com
 * highly configurable : being used in almost all the jstree instances.
 * 
 */
(function () {
    angular
            .module('testRuns')
            .directive('jstreePagination', jstreePagination);


    jstreePagination.inject = [];

    function jstreePagination()
    {
        return {
            restrict: 'EA',
            scope: true,
            link: function (scope, element, attrs) {
                var treeId = attrs.id;
                element = $(element);
                element.jstree({
                    'plugins': ["state"],
                    'core': {
                        'check_callback': true
                    }
                });

                element.on('ready.jstree', function (e, data) {
                    loadMoreItems(1);
                });

                function loadMoreItems(moreId) {
                    var leftCount = dataStore.getLeftItemCount(moreId);
                    var parentId = parseInt(moreId / 100);
                    if (parentId < 1)
                        parentId = treeId;
                    var data = dataStore.getNextPage(moreId);
                    element.jstree(true).delete_node([moreId]);
                    for (var i = 0; i < data.length; i++) {
                        createNode("#" + parentId, data[i].id, data[i].text, "last");
                        if (data[i].id < 1000000) {
                            createNode("#" + data[i].id, data[i].id * 100 + 1, data[i].text, "last");
                        }
                    }
                    
                    var leftItemCount = leftCount - data.length;
                    if (leftItemCount > 0) {
                        var lastItemId = data[data.length - 1].id + 1;
                        createNode("#" + parentId, lastItemId, " <a id='" + lastItemId + "'>Load More (" + leftItemCount + " Left)</a>", "last");
                        $("#" + lastItemId).click(function (event) {
                            loadMoreItems(lastItemId);
                        });
                    }
                }
                ;

                element.on('open_node.jstree', function (e, data) {
                    var children = data.node.children;
                    if (children.length === 1) {
                        loadMoreItems(Number(data.node.li_attr.id) * 100);
                    }
                });

                function createNode(parent_node, new_node_id, new_node_text, position) {
                    element.jstree('create_node', $(parent_node), {"text": new_node_text, "id": new_node_id}, position, false, false);
                }

                function removeSelectedNode() {
                    element.jstree(true).delete_node($('#'+treeId).jstree('get_selected'));
                }

                //build a data storage so I can ask for the next page of item with id 0, starting page
                var dataStore = new DataStore();

                function DataStore() {
                    var pageSize = 6;
                    var MaximumPerLevel = 25;

                    this.getLeftItemCount = function (lastItemId) {
                        while (lastItemId >= 100) {
                            lastItemId = lastItemId - 100;
                        }
                        return MaximumPerLevel - lastItemId + 1;
                    };

                    this.getNextPage = function (lastchildid) {

                        var result = [];
                        for (var i = lastchildid; i < lastchildid + pageSize; i++) {
                            result.push(
                                    {
                                        "id": i,
                                        "text": i
                                    });
                        }
                        return result;
                    };
                }
            }
        };
    }
    ;

})();
