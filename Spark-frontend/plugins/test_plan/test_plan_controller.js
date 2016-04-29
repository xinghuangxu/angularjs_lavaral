/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testPlan')
        .controller('testPlanController',testPlanController);

    testPlanController.$inject=['pluginsConfigValue'];

    function testPlanController(pluginsConfigValue){
        var TPCtrl = this;
        TPCtrl.release_id = pluginsConfigValue.release_id;
        TPCtrl.stack_id = pluginsConfigValue.stack_id;
        TPCtrl.substack_id = pluginsConfigValue.substack_id;
    }
})();
