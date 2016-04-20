/**
 * Created by e897x724 on 4/8/2016.
 */
(function(){
    'use strict';

    angular
        .module('commonComponents')
        .service('SISService',SISService);

    SISService.$inject= ['$http','pluginNamesConstant'];


    function SISService($http,pluginNamesConstant){

        this.getSuggestedTestStrategies= getSuggestedTestStrategies;

        function getSuggestedTestStrategies(arg){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer+'/rest/SIS/ts',
                params: {
                    'adviser_type': 'ts_adviser',
                    'StrategyHeadline': arg.strategy_headline||'',
                    'TestStrategy': arg.test_strategy||'',
                    'categories': arg.categories||[],
                    'num_ts': 10,
                    'Override_knob_values': 'false'
                }
            });

        }


    }
})();

