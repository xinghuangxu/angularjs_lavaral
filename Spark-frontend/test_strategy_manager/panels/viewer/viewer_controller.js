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
        TSSVCtrl.promoteTestStrategy = promoteTestStrategy;
        TSSVCtrl.demoteTestStrategy = demoteTestStrategy;
        TSSVCtrl.obsoleteTestStrategy = obsoleteTestStrategy;
        TSSVCtrl.approveTestStrategy = approveTestStrategy;
        TSSVCtrl.varyTestStrategy = varyTestStrategy;
        TSSVCtrl.reviewTestStrategy = reviewTestStrategy;


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

        function promoteTestStrategy(id){
            strategyViewerServices.promoteTestStrategy(id).then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

        function demoteTestStrategy(id){
            strategyViewerServices.demoteTestStrategy(id).then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

        function obsoleteTestStrategy(id){
            strategyViewerServices.obsoleteTestStrategy(id).then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

        function approveTestStrategy(id){
            strategyViewerServices.approveTestStrategy(id).then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

        function varyTestStrategy(){
            strategyViewerServices.varyTestStrategy().then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

        function reviewTestStrategy(){
            strategyViewerServices.reviewTestStrategy().then(function(response){
                // we should use show an indicator here that the operation has been achieved
            });
        }

    }



})();
