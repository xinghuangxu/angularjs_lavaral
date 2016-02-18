

(function() {
    'use strict';

    angular
        .module('spark.rally')
        .factory('rallyDataService', rallyDataService)
        .factory('rallyDataSet', rallyDataSet);


    rallyDataService.$inject = [ '$resource'];

    /**
     * Service for fetching information about ALM databases and folders
     */
    function rallyDataService ($resource)
    {
        // The default resouce calls will work with the list of databases.
        // Extensions must specify all their options, including the URL, to
        // make sure that the proper folder resources are fetched
        return {
            projects: $resource('/rest/rally/projects', {}, {
                projectList: {method: 'GET', timeout: '60000'}
            }),
            releases: $resource('/rest/rally/projects/:input/releases', {input: 'projectChosen'}, {
                releaseList: {method: 'GET', timeout: '60000'}
            }),
            iterations: $resource('/rest/rally/projects/:input/iterations', {input: 'project'}, {
                IterationList: {method: 'GET', timeout: '60000'}
            }),
            RallyData: $resource('/rest/rally/userstories', {}, {
                treeData: {method: 'GET', timeout: '60000', params: {project: 'project', release: 'release'}}
            }),
            RallyDataDelete: $resource('/rest/rally/userstories/:input', {}, {
                deleteNode: {method: 'DELETE', timeout: '60000'}
            }),
            RallyDataCreate: $resource('/rest/rally/userstories/create', {}, {
                AddNode: {method: 'GET', timeout: '60000'}
            }),
            RallyDataDetails: $resource('/rest/rally/userstories/:input', {}, {
                metadata: {method: 'GET', timeout: '60000'},
                EQI: {method: 'GET', params: {accepted: 'EQI', fetch: 'true'}, timeout: '60000'}
            }),
            RallyDataUpdate: $resource('/rest/rally/userstories/', {}, {
                updateNode: {method: 'GET', timeout: '60000'},
            }),
            RallyDataDragDrop: $resource('/rest/rally/userstories/', {}, {
                dragdrop: {method: 'GET', params: {drag: true}, timeout: '60000'},
            })
        };
    }


    rallyDataSet.$inject = [];
    
    function rallyDataSet(){
        var rallyDataSet = {
        actionNode: null,
        deleteSuccess: false,
        editInfo: {nodeID: null, name: null, archID: null, iteration: null, icon: null, blocked: null},
        addNode: {nodeID: null, name: null, archID: null, iteration: null, icon: null, blocked: null},
        selectedNode: {nodeID: null, children: null, name: null}
    };
    return rallyDataSet;
    }
    
})();