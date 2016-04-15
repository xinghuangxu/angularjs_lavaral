/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager')
        .controller('strategyViewerController',
            strategyViewerController);

    strategyViewerController.$inject= [];
    function strategyViewerController(){

        var TSSVCtrl =this;

        TSSVCtrl.tags_impact_area = [
            {
                CategoryID: "6",
                CategoryName: "Operational behavior",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            },
            {
                CategoryID: "7",
                CategoryName: "Operational behavior 2",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            },
            {
                CategoryID: "6",
                CategoryName: "Operational behavior",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            },
            {
                CategoryID: "7",
                CategoryName: "Operational behavior 2",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            }
        ];
        TSSVCtrl.tags_qual_area = [
            {
                CategoryID: "6",
                CategoryName: "Operational behavior",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            },
            {
                CategoryID: "7",
                CategoryName: "Operational behavior 2",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            }
        ];
        TSSVCtrl.tags_test_approach = [
            {
                CategoryID: "6",
                CategoryName: "Operational behavior",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            },
            {
                CategoryID: "7",
                CategoryName: "Operational behavior 2",
                CategoryPath: "Root\Default\Qualification Areas",
                CategoryFatherID: "5",
                IsActive: "1",
                pivot: {
                    StrategyID: "139",
                    CategoryID: "6"
                }
            }
        ];
        TSSVCtrl.StrategyHeadline = 'Strategy Headline';
        TSSVCtrl.Goal = 'Goal';





    }



})();
