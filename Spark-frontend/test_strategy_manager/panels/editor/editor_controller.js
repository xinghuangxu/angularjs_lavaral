/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager')
        .controller('strategyEditorController',
            strategyEditorController);

    strategyEditorController.$inject= ['$state','SISService','SISSuggestionsValue'];
    function strategyEditorController($state,SISService,SISSuggestionsValue){

        var strategyEditorCtlr =this;
        strategyEditorCtlr.strategy={headline:null,impact_area:null,qlt_area:null,approach:null,goal:null, };


        strategyEditorCtlr.changeLeftPlugin=changeLeftPlugin;
        strategyEditorCtlr.isTabActive = isTabActive;
        strategyEditorCtlr.editorValueChanged = editorValueChanged;


        function changeLeftPlugin (state_name){

            $state.transitionTo(state_name);

        }
        function isTabActive(state_name) {
            return $state.current.name.indexOf(state_name) > -1
        }
        function editorValueChanged(){
            var arg = {
                'adviser_type': 'ts_adviser', // Keep this static for the Test Strategy Manager
                'StrategyHeadline': strategyEditorCtlr.strategy.headline,
                'TestStrategy': 'description contents',
                'categories': [strategyEditorCtlr.strategy.impact_area,
                               strategyEditorCtlr.strategy.qlt_area,
                               strategyEditorCtlr.strategy.approach],
                'num_ts': 10,    // Leave at 10 as default for now. Should be dealt with in configuration
                'Override_knob_values': 'false' // Leave at 'false' as default for now.
            };
            console.log(arg);
            SISSuggestionsValue.test_strategies=null;
            //SiS service is not working remove these values when it starts working
            SISSuggestionsValue.test_strategies =[{
                "StrategyID": 4239,
                "StrategyHeadline": "SAM-EF Pool Management: Secure Erase Drives?",
                "rel": 0.4133198922545748
            },{
                "StrategyID": 4200,
                "StrategyHeadline": "Storage System Failure",
                "rel": 0.4133198922545748
            },{
                "StrategyID": 3135,
                "StrategyHeadline": "ABC",
                "rel": 0.4133198922545748
            },{
                "StrategyID": 4056,
                "StrategyHeadline": "Error handling for missing/corrupted files in cloud storage account (metadata files and data objects)",
                "rel": 0.4133198922545748
            },{
                "StrategyID": 4061,
                "StrategyHeadline": "Error handling for cloud provider-specific errors",
                "rel": 0.4133198922545748
            }];
            //SiS service is not working
            // SISService.getSuggestedTestStrategies(arg).then(function(){
            //
            // });

        }


    }



})();
