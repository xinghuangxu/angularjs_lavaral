/**
 * Created by Rameez Aijaz on 3/11/2016.
 */
(function(){
    'use strict';
    angular.module('testStrategyManager').controller('testStrategyManagerController',testStrategyManagerController);

    testStrategyManagerController.$inject= ['$state'];
    function testStrategyManagerController($state){

        var TSMCtrl =this;
        console.log('testStrategyManager');
        TSMCtrl.viewer_is_active=true;
        TSMCtrl.editor_is_active=false;

        TSMCtrl.numberOfActiveTabs= function(){
                var i =0;
            if(TSMCtrl.viewer_is_active)
            {
                i++;
            }
            if(TSMCtrl.editor_is_active)
            {
                i++;
            }
            if($state.current.name.split('tsm')[1])
            {
                i++;
            }
            return i;
        }


    }



})();
