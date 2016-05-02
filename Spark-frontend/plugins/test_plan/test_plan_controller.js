/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testPlan')
        .controller('testPlanController',testPlanController);

    testPlanController.$inject=['pluginsConfigValue', 'testPlanService'];

    function testPlanController(pluginsConfigValue, testPlanService){
        var TPCtrl = this;

        TPCtrl.release_id = pluginsConfigValue.release_id;
        TPCtrl.stack_id = pluginsConfigValue.stack_id;
        TPCtrl.substack_id = pluginsConfigValue.substack_id;

        if (TPCtrl.release_id && TPCtrl.stack_id && TPCtrl.substack_id)
            TPCtrl.tree = loadTreeData;

        function loadTreeData(obj, cb){
            var node_id = obj.id;
            if (node_id == '#'){
                testPlanService.getTopList().then(function(response){
                    cb.call(this, testPlanService.getTopListTree(response));
                });
                return;
            }
            if (obj.data === 'ts_cat'){
                testPlanService.getTestPlanCategories(node_id).then(function(response){
                    cb.call(this, testPlanService.getTestPlanCategoriesTree(response));
                });
                return;
            }
            if (obj.data === 'tc_cat'){
                testPlanService.getTestCasesCategories(node_id).then(function(response){
                    cb.call(this, testPlanService.getTestCasesCategoriesTree(response));
                });
                return;
            }
            testPlanService.getTestcases(node_id).then(function(response){
                cb.call(this, testPlanService.getTestcasesTree(response));
            });
        }

    }
})();
