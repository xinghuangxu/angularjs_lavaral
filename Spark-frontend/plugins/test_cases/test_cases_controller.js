/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';
    angular
        .module('testCases')
        .controller('testCasesController', testCasesController);


    testCasesController.$inject=[ 'testCasesService'];


    function testCasesController( testCasesService){


        var TSCtrl= this;

        TSCtrl.config = {
            groupBy: testCasesService.getArrangeBy(),
            activeGroup: testCasesService.getArrangeBy().NONE
        };
        TSCtrl.tree = null;
        TSCtrl.loadTreeData = loadTreeData;


        // $scope.$on('planSettingChanged', function (event, settings) {
        //     if (settings.data.alm_db_name && settings.data.testplan_stack_id.match(/^LSIP2/)){
        //         TSCtrl.tree = getTreeData;
        //     }
        // });

        function loadTreeData(){
            TSCtrl.tree = getTreeData;
        }



        function getTreeData(obj, cb){
            var node_id = obj.id;
            if (node_id == '#'){
                testCasesService.getFolders().then(function(response){
                    cb.call(this, testCasesService.getTreeJson(response));
                });
                return;
            }

            testCasesService.getTestCases(node_id).then(function(response){
                cb.call(this, testCasesService.getTreeCaseTreeJson(response));
            });
        }

    }
})();
