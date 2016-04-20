(function(){
    angular.module('testPlanner', [
        'mgcrea.ngStrap',
        'ngAnimate',
        'commonComponents',
        'referenceDocuments',
        'scopingInfo',
        'testRuns',
        'testCases',
        'testPlan',
        'testStrategy'

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
