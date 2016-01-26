/**
 * Module service definition for Spark testcase module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testcase')
        .factory('testcaseService', testcaseService)
        .service('$testcases', testcaseModalService);

    testcaseService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about tags
     */
    function testcaseService ($resource){
        return $resource('/rest/alm/testCases');
    }
    
    testcaseModalService.$inject = ['$rootScope', '$modal', '$timeout', '$q'];
    /**
     * Service provider for modal dialogs to select testcases
     */
    function testcaseModalService($rootScope, $modal, $timeout, $q) {
        return function(dest) {
            var modalScope = $rootScope.$new();
            modalScope.add = addTestcase;
            modalScope.dest = dest;

            var modal = $modal({
                title: 'Add Test Cases From ALM',
                contentTemplate: '/angular/testcase/testcaseModal.tpl.html',
                controller: 'AddTestCase',
                controllerAs: 'testcase',
                scope: modalScope
            });
            var deferred = $q.defer();
            modal.$promise = deferred.promise;
            
            var parentHide = modal.hide;
            modal.hide = hide;
            
            return modal;
            
            /**
             * Return the testcase to the parent controller
             * 
             * @param {object} testcase Testcase to send back
             * @param {array} dest Array to append data to
             */
            function addTestcase(db, testcase) {
                if(!modalScope.dest) {
                    // No target given
                    return;
                }
                
                if(!modalScope.dest.hasOwnProperty(db)) {
                    modalScope.dest[db] = [testcase];
                    testcase.added = true;
                } else {
                    modalScope.dest[db].push(testcase);
                    testcase.added = true;
                }
            }
            
            /**
             * Hide the modal
             */
            function hide() {
                deferred.resolve(true);
                parentHide();
            }
        }
    }
})();
