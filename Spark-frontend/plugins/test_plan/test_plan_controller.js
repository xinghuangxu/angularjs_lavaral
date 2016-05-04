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

        TPCtrl.getArrangeBy = getArrangeBy;
        TPCtrl.arrange_by = null;

        TPCtrl.release_id = pluginsConfigValue.release_id;
        TPCtrl.stack_id = pluginsConfigValue.stack_id;
        TPCtrl.substack_id = pluginsConfigValue.substack_id;
        // TPCtrl.icons = [
        //     {
        //         "value":"1",
        //         "label":"Gear"
        //     },
        //     {
        //         "value":"2",
        //         "label":"Globe"
        //     },
        //     {
        //         "value":"3",
        //         "label":"Heart"
        //     },
        //     {
        //         "value":"4",
        //         "label":"Camera"
        //     }
        // ];
        //
        // TPCtrl.selectedIcon = TPCtrl.icons[0].value;


        if (TPCtrl.release_id && TPCtrl.stack_id && TPCtrl.substack_id){
            TPCtrl.tree = loadTreeData;
            getArrangeBy();
        }

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

        function getArrangeBy(){
            testPlanService.getArrangeBy().then(function(response){
                TPCtrl.arrange_by = response.data;
                SetDefaultArrangeBy();
            });
        }

        function SetDefaultArrangeBy(){
            for (var i=0; i<TPCtrl.arrange_by.length; i++){
                if (TPCtrl.arrange_by[i].isDefault === true)
                    TPCtrl.selectedIcon = TPCtrl.arrange_by[i].value;
            }
        }

    }
})();
