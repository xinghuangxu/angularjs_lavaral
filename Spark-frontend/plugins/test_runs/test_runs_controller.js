/**
 * Created by e897x724 on 3/21/2016.
 */
(function () {
    'use strict';
    angular.module('testRuns').controller('testRunsController', testRunsController);
    testRunsController.$inject = [];
    function testRunsController() {

        var TRCtrl = this;
        TRCtrl.paginationTreeData = [
            {"text": "Root node", "children": [
                    {"text": "Child node 1"},
                    {"text": "Child node 2"}
                ]}
        ];
        
        
    }

    //use to generate fake data.
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

})();
