/**
 * JSTree component directive
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

 (function() {
     'use strict';

     angular
         .module('spark.ui')
         .directive("sparkJstree", sparkJstree);

     /**
      * Directive for handling jsTree elements in Angular
      *
      * @return {object} Directive instance for Angular to work with
      */
     function sparkJstree () {
         // Default options for the tree
         var defaultConfig = {
             plugins: ['themes', 'dnd', 'search'],
             core: {
                 themes: {
                     theme: 'default',
                     dots: false,
                     icons: true
                 },
                 check_callback: function(operation, node, node_parent, node_position, more) {
                     return operation === 'rename_node' ? true : true;
                 },
                 search : {
                     "case_sensitive" : false,
                     "show_only_matches" : true,
                     "fuzzy": false
                 }
             }
         };

         function JSTree () {
             var vm = this;
         }

         return {
             restrict: 'E',
             scope: {
                 filter: '=?filter',
                 config: '=?config',
                 selectCallback: '&onSelect',
                 api: '=?',
                 data: '=ngModel'
             },
             controller: JSTree,
             controllerAs: 'jstree',
             bindToController: true,
             link: function(scope, element, attrs, jstree) {
                 // Setup the selection callback, if it is defined
                 if(typeof jstree.selectCallback === 'function') {
                     $(element).on('select_node.jstree',
                         function(e, data) {
                             jstree.selectCallback({data: data});
                             $(element).jstree(true).open_node(data.node.id);
                         });
                 }
                 
                 // Copy new values from config into default
                 angular.merge(defaultConfig, jstree.config);

                 $(element).jstree(defaultConfig);
                 jstree.api = $(element).jstree();

                 // Watch for changes and render as needed
                 scope.$watch('jstree.data',
                     function(data) {
                         if(data) {
                             $(element).jstree(true).settings.core.data = data;
                             $(element).jstree(true).refresh();
                         }
                     },
                     true
                 );

                 // Watch for the search term to change
                 scope.$watch('jstree.filter',
                     function(data) {
                         if(!data || data === "") {
                             $(element).jstree(true).clear_search();
                         } else if (data.length < 3) {
                             // Skip searching for strings < 3 chars
                             return;
                         } else {
                             $(element).jstree(true).search(data);
                         }
                     }
                 );
             }
         };
     }

 })();
