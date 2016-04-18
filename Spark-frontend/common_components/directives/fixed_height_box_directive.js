(function () {
    'use strict';
    angular.module('commonComponents').directive('fixedHeightBox', fixedHeightBox);
    fixedHeightBox.$inject = [];
    function fixedHeightBox() {
        return {
            link: function (scope, element, attrs) {
                    var window_height = $(window).height();
                    if ($("body").hasClass("fixed")) {
                        setTimeout(function(){
                            $(".box-plugin-body").css('height', window_height - $('.main-footer').outerHeight() - 180);
                            $(".box-plugin-form-body").css('height', window_height - $('.main-footer').outerHeight() - 232);
                        },400)

                    }

            }
        };
    }
})();