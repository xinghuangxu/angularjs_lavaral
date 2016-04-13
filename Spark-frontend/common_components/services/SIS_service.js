/**
 * Created by e897x724 on 4/8/2016.
 */
(function(){
    'use strict';

    angular
        .module('commonComponents')
        .service('SISService',SISService);

    SISService.$inject= ['$http'];


    function SISService($http){

        this.getSuggestedTestStrategies= getSuggestedTestStrategies;

        function getSuggestedTestStrategies(arg){
            //comment it out when sis service backend is ready
            // return $http({
            //     method: 'POST',
            //     url: '',
            //     data: {
            //         'adviser_type': 'ts_adviser',
            //         'StrategyHeadline': 'CLI Stuff',
            //         'TestStrategy': 'very long description of the contents of this particular test strategy.',
            //         'categories': [35, 168, 418, 111, 6752],
            //         'num_ts': 10,
            //         'Override_knob_values': 'false'
            //     }
            // })

        }


    }
})();

