/**
 * Directive for custom validation on test strategies
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-08
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.common')
        .directive('sparkArrayValidator', arrayValidator);
    
    arrayValidator.$inject = [];
    /**
     * Array validation directive
     */
    function arrayValidator() {
        return {
            require: 'ngModel',
            scope: {
                options: '=sparkArrayValidator'
            },
            link: function(scope, elem, attrs, ctrl) {
                ctrl.$validators.tag = validate;
                
                function validate(modelValue, viewValue) {
                    if(scope.options && scope.options.multi) {
                        if(modelValue && modelValue.length >= 1){
                            // Multiples are allowed, and at least one is set
                            return true;
                        }
                    } else if(modelValue && modelValue.length === 1) {
                        // Only one is allowed, and exactly one is set
                        return true;
                    }
                    return false;
                }
            }
        };
    }
})();
