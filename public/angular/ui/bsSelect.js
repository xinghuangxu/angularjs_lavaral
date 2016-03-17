/**
 *
 * @author Leon Xu
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-17
 *
 */

(function () {
    'use strict';

    angular
            .module('spark.ui')
            .directive('sparkBsSelect', sparkBsSelect);

    sparkBsSelect.$inject = ['$window', '$parse', '$q', '$select', '$parseOptions'];
    /**
     * Service for flashing html input fields
     */
    function sparkBsSelect($window, $parse, $q, $select, $parseOptions) {
        var defaults = $select.defaults;
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function postLink(scope, element, attr, controller) {
                var options = {
                    scope: scope,
                    placeholder: defaults.placeholder
                };
                angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'placeholder', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id', 'sort', 'caretHtml', 'prefixClass', 'prefixEvent'], function (key) {
                    if (angular.isDefined(attr[key]))
                        options[key] = attr[key];
                });
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['html', 'container', 'allNoneButtons', 'sort'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
                        options[key] = false;
                });
                var dataMultiple = element.attr('data-multiple');
                if (angular.isDefined(dataMultiple)) {
                    if (falseValueRegExp.test(dataMultiple))
                        options.multiple = false;
                    else
                        options.multiple = dataMultiple;
                }
                if (element[0].nodeName.toLowerCase() === 'select') {
                    var inputEl = element;
                    inputEl.css('display', 'none');
                    element = angular.element('<button type="button" class="btn btn-default"></button>');
                    inputEl.after(element);
                }
                var parsedOptions = $parseOptions(attr.bsOptions);
                var select = $select(element, controller, options);
                if (select.$isIE()) {
                    element[0].addEventListener('blur', select.$selectScrollFix);
                }
                var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
                scope.$watch(watchedOptions, function (newValue, oldValue) {
                    parsedOptions.valuesFn(scope, controller).then(function (values) {
                        select.update(values);
                        controller.$render();
                    });
                }, true);
                scope.$watch(attr.ngModel, function (newValue, oldValue) {

                    if (attr.limit && attr.limit < newValue.length) {
                        for (var i = 0; i < newValue.length; i++) {
                            if (i >= oldValue.length)
                                break;
                            if (!angular.equals(newValue[i], oldValue[i]))
                                break;
                        }

                        if (i === newValue.length) {
                            newValue.pop();
                        } else {
                            newValue.splice(i, 1);
                        }
                    }

                    select.$updateActiveIndex();
                    controller.$render();
                }, true);
                controller.$render = function () {
                    var selected, index;
                    if (options.multiple && angular.isArray(controller.$modelValue)) {
                        selected = controller.$modelValue.map(function (value) {
                            index = select.$getIndex(value);
                            return angular.isDefined(index) ? select.$scope.$matches[index].label : false;
                        }).filter(angular.isDefined);
                        if (selected.length > (options.maxLength || defaults.maxLength)) {
                            selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
                        } else {
                            selected = selected.join(', ');
                        }
                    } else {
                        index = select.$getIndex(controller.$modelValue);
                        selected = angular.isDefined(index) ? select.$scope.$matches[index].label : false;
                    }
                    element.html((selected ? selected : options.placeholder) + (options.caretHtml ? options.caretHtml : defaults.caretHtml));
                };
                if (options.multiple) {
                    controller.$isEmpty = function (value) {
                        return !value || value.length === 0;
                    };
                }
                scope.$on('$destroy', function () {
                    if (select)
                        select.destroy();
                    options = null;
                    select = null;
                });
            }
        };
    }
    ;
})();
