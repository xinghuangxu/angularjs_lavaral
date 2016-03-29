/**
 * Module service definition for Spark ALM module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-16
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.alm')
        .factory('almFolderService', almFolderService);

    almFolderService.$inject = [ '$resource', '$http' ];

    /**
     * Service for fetching information about ALM databases and folders
     */
    function almFolderService ($resource, $http)
    {
        // The default resouce calls will work with the list of databases.
        // Extensions must specify all their options, including the URL, to
        // make sure that the proper folder resources are fetched
        return $resource("/rest/alm/databases/:database?", {},
            {
                // Get the root folders for a domain
                folders: {
                    url: '/rest/alm/databases/:database/folder/:folderId?',
                    method: 'GET',
                    params: { database: '@database', folderId: '@folderId' },
                    isArray: true,
                    cache: true,
                    transformResponse: setIcons
                }
            }
        );
        
        /**
         * Set the icons of the nodes based on if they have children
         * 
         * @param {string} data JSON string of input data
         * @return {object} Parsed JSON with icons set for tree
         */
        function setIcons(data) {
            if(typeof data === 'string') {
                data = JSON.parse(data);
            } 
            
            angular.forEach(data, function(val, key) {
                if(val.hasChildren) {
                    val.icon = 'glyphicon glyphicon-folder-open'
                }
            });
            
            return data;
        }
    }
})();
