(function(){
    angular.module('testPlanner', [
        'mgcrea.ngStrap',
        'ngAnimate',
        'commonComponents',
        'referenceDocuments',
        'boxcar',
        'configurationPlan',
        'highLevelScope',
        'implementationRequests',
        'rally',
        'rcca',
        'sow',
        'testCaseInstances',
        'testCases',
        'testPlan',
        'webLab'

    ]);

})();


//
//angular.module('seedApp').run(function($rootScope) {
//
//    $rootScope.safeApply = function(fn) {
//        var phase = $rootScope.$$phase;
//        if (phase === '$apply' || phase === '$digest') {
//            if (fn && (typeof(fn) === 'function')) {
//                fn();
//            }
//        } else {
//            this.$apply(fn);
//        }
//    };
//
//});
