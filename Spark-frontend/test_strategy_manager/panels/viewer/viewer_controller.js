/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager')
        .controller('strategyViewerController',
            strategyViewerController);

    strategyViewerController.$inject= ['strategyViewerServices'];
    function strategyViewerController(strategyViewerServices){

        var TSSVCtrl =this;

        TSSVCtrl.getTestStrategyDetails = getTestStrategyDetails;
        TSSVCtrl.testStrategy = {
            impactArea: null,
            qualArea: null,
            approach: null,
            headLine: null,
            goal: null
        };

        function getTestStrategyDetails(id){
            strategyViewerServices.getStrategyDetails(id).then(function(response){
                TSSVCtrl.testStrategy.headLine = response.data.StrategyHeadline;
                TSSVCtrl.testStrategy.goal = response.data.Goal;
                TSSVCtrl.testStrategy.impactArea = response.data.tags_impact_area;
                TSSVCtrl.testStrategy.qualArea =  response.data.tags_qual_area;
                TSSVCtrl.testStrategy.approach = response.data.tags_test_approach;
            });
        }

    }



})();
