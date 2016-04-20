/**
 * Created by e897x724 on 4/15/2016.
 */
(function () {
    'use strict';

    angular.module('testStrategyManager').config(textAngularDecorator);
    textAngularDecorator.$inject=['$provide'];
    function textAngularDecorator ($provide){
        $provide.decorator('taOptions', ['$delegate', function (taOptions) {
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
            ];
            return taOptions;
        }]);
    }
})();
