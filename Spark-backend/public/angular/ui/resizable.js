/**
 * Resizable component directive
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-04
 *
 */

 (function() {
     'use strict';

     angular
         .module('spark.ui')
         .directive("sparkResizable", sparkResizable);

     /**
      * Directive for handling resiable elements in the test planner
      *
      * @return {object} Directive instance for Angular to work with
      */
     function sparkResizable () {
         /**
          * Get the default width an element should have when added
          *
          * @param  {Element} elem  DOM Element to set the width on
          *
          * @return {int} Width the new elemnt should have
          */
         var getDefaultWidth = function(elem) {
             var parentWidth = elem.parent().width();
             var children = elem.siblings().length + 1;
             var childrenWidth = 0;

             // Inspect the siblings of the new element to see if they have been resized, and exclude them if they have
             $.each(elem.siblings(), function(ind, obj) {
                 if(angular.element(obj).scope().resized) {
                     childrenWidth += $(obj).width;
                     children--;
                 }
             });

             return (parentWidth - childrenWidth) / children;
         };

         return {
             // Must be applied to each element in the container as an attribute
             restrict: 'A',
             link: function (scope, element, attrs) {
                 // Default options for the jquery UI resizable()
                 var opts = {
                     handles: "e",
                     ghost: true,
                     minWidth: 150,

                     /**
                      * Resets the 'left' css property on resize to protect alignments
                      *
                      * @param  {Event} e   Event handler for the resize event
                      * @param  {object} ui jquery-ui element we are acting on
                      */
                     resize: function(e, ui) {
                         ui.element.css('left', "");
                     },

                     /**
                      * Resize neighboring panels when resize event ends
                      *
                      * This makes each pair of panels have a constant width,
                      * so making one larger shrinks the other.

                      * @param  {Event} e   Event handler for the resize event
                      * @param  {[type]} ui jquery-ui element we are acting on
                      */
                     stop: function(e, ui) {
                         var nextWid = ui.element.next().width();
                         var widDiff = ui.size.width - ui.originalSize.width;
                         ui.element.next().width(nextWid-widDiff);
                         scope.resized = true;
                         angular.element(ui.element.next()).scope().resized = true;
                     }

                 };

                 /*
                     Check to see if we are the last element, and disable the resize
                     and enable the previous element if it exists.

                     This will still work since the resize is attached to the left-
                     hand sibling
                  */
                 if($(element).is(":last-child")) {
                     $(element).prev().resizable('option', 'disabled', false);
                     opts.disabled = true;
                 }

                 // Create the resizable and adjust the siblings as needed
                 $(element).resizable(opts);
                 var width = getDefaultWidth(element);
                 $(element).width(width);
                 $.each($(element).siblings(),
                     function(ind, obj) {
                         // Only change widths for other items which haven't been resized
                         if(!angular.element(obj).scope().resized)
                             $(obj).width(width);
                     }
                 );
             }
         };
     }
 })();
