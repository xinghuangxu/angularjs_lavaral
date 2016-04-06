/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager')
        .controller('strategyEditorController',
            strategyEditorController);

    strategyEditorController.$inject= ['$state'];
    function strategyEditorController($state){

        var strategyEditorCtlr =this;


        strategyEditorCtlr.changeLeftPlugin=changeLeftPlugin;
        strategyEditorCtlr.isTabActive = isTabActive;

        function changeLeftPlugin (state_name){

            $state.transitionTo(state_name);

        }
        function isTabActive(state_name) {
            return $state.current.name.indexOf(state_name) > -1
        }



    }



})();
