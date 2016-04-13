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

        function loadTreeData(){
            TSCtrl.tree = getTreeData;
        }



        function getTreeData(obj, cb){
            var node_id = obj.id;
            if (node_id == '#'){
                testCasesService.getTestCasesRepositories().then(function(response){
                    cb.call(this, testCasesService.getTestCasesRepositoriesTree(response));
                });
                return;
            }
            if (obj.data === 'testCaseRepo'){
                testCasesService.getFolders(node_id).then(function(response){
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
