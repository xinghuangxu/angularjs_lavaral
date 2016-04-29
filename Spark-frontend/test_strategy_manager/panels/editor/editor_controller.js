/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager')
        .controller('strategyEditorController',
            strategyEditorController);

    strategyEditorController.$inject= ['$state','SISService','SISSuggestionsValue', 'strategyEditorServices','dropdown_values'];
    function strategyEditorController($state,SISService,SISSuggestionsValue, strategyEditorServices,dropdown_values){

        var strategyEditorCtlr =this;
        strategyEditorCtlr.strategy={headline:null,impact_area:null,qlt_area:null,approach:null,goal:null };
        strategyEditorCtlr.qualTreeData = [];
        strategyEditorCtlr.impactTreeData = [];
        strategyEditorCtlr.approachTreeData = [];
        strategyEditorCtlr.impact_tree_data = strategyEditorServices.buildTagTree(dropdown_values[0].data);
        strategyEditorCtlr.qual_tree_data =strategyEditorServices.buildTagTree(dropdown_values[1].data);
            strategyEditorCtlr.approach_tree_data=strategyEditorServices.buildTagTree(dropdown_values[2].data);
        strategyEditorCtlr.changeLeftPlugin=changeLeftPlugin;
        strategyEditorCtlr.isTabActive = isTabActive;
        strategyEditorCtlr.editorValueChanged = editorValueChanged;
        strategyEditorCtlr.tree_config ={

            plugins: ["search", "dnd", "checkbox"],
            search: {
                "case_sensitive": false,
                "show_only_matches": true
            },
            core: {
                multiple: true,
                themes: {
                    "theme": "default",
                    "icons": true,
                    "dots": false
                }
            }
        };


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
