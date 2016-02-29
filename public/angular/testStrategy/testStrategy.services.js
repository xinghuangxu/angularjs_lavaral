/**
 * Module service definition for Spark test strategy module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.testStrategy')
        .factory('testStrategyService', testStrategyService)
        .service('$strategy', testStrategyModalService);

    testStrategyService.$inject = [ '$resource' ];

    /**
     * Service for fetching information about testplan scopes
     */
    function testStrategyService ($resource) {
        return $resource("/rest/strategies/:StrategyID?", {StrategyID: '@StrategyID', perpage: 'all'}, {
            get: {
                params: {details: true},
                transformResponse: appendApproach
            },
            query: {
                params: {fields: 'StrategyID,StrategyHeadline,State,Owner,ModifiedDate'},
                transformResponse: appendApproach,
                isArray: true
            },
            save: {
                method: 'PUT',
                transformResponse: appendApproach
            },
            patch: {
                method: 'PATCH',
                transformResponse: appendApproach,
            },
            'new': {
                method: 'POST',
                transformResponse: appendApproach
            },
            rev: {
                url: '/rest/strategies/:StrategyID/rev',
                method: 'POST'
            },
            vary: {
                url: '/rest/strategies/:StrategyID/vary',
                method: 'POST'
            },
            approve: {
                url: '/rest/strategies/:StrategyID/approve',
                method: 'POST'
            },
            promote: {
                url: '/rest/strategies/:StrategyID/promote',
                method: 'POST'
            },
            demote: {
                url: '/rest/strategies/:StrategyID/demote',
                method: 'POST'
            },
            obsolete: {
                url: '/rest/strategies/:StrategyID/obsolete',
                method: 'POST'
            }
        });

        /**
         * Fix the incoming data
         *
         * @param {string} data Incoming data from the service
         * @return {object|array} Parsed data
         */
        function appendApproach(data) {
            if(typeof data === 'string') {
                data = JSON.parse(data);
            }

            if(Array.isArray(data)) {
                angular.forEach(data, function(val, key) {
                    val = fix(val);
                });
            } else {
                data = fix(data);
            }

            return data;

            /**
             * Add a new field to represent the approach ID
             *
             * @param {object} item Item to tweak
             * @return {object} Fixed item
             */
            function fix(item) {
                if(item && item.tags_test_approach && item.tags_test_approach.length > 0) {
                    item.approach = item.tags_test_approach[0].CategoryID;
                }

                return item;
            }
        }
    }

    testStrategyModalService.$inject = ['$rootScope', '$modal', '$q'];
    /**
     * Service provider for strategy editor as modal
     */
    function testStrategyModalService($rootScope, $modal, $q) {
        return function(id) {
            var modalScope = $rootScope.$new();

            if(id) {
                modalScope.id = id;
            }

            var modal = $modal({
                title: 'Test Strategy Editor',
                contentTemplate: 'angular/testStrategy/testStrategy.tpl.html',
                controller: 'Strategy',
                controllerAs: 'strategy',
                scope: modalScope
            });

            return modal;
        }
    }

})();
