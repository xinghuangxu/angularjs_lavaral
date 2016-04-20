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
        strategyEditorCtlr.strategy={headline:null,impact_area:null,qlt_area:null,approach:null,goal:null };


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
                strategy_headline: strategyEditorCtlr.strategy.headline,
                test_strategy: strategyEditorCtlr.strategy.description
                //uncomment it when dropdowns are working
                // 'categories': [strategyEditorCtlr.strategy.impact_area,
                //                strategyEditorCtlr.strategy.qlt_area,
                //                strategyEditorCtlr.strategy.approach],
            };
            SISSuggestionsValue.test_strategies=null;
            SISService.getSuggestedTestStrategies(arg).then(function(resp){
                SISSuggestionsValue.test_strategies =resp.data.results;
            });

        }


    }



})();
