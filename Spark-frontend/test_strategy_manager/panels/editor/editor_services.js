/**
 * Created by p684j362 on 4/19/2016.
 */

(function(){
    'use strict';

    angular
        .module('testStrategyManager')
        .service('strategyEditorServices', strategyEditorServices);

    strategyEditorServices.$inject = ['$http', 'pluginNamesConstant'];

    function strategyEditorServices($http, pluginNamesConstant){

        this.getQualifications = getQualifications;
        this.getImpactArea = getImpactArea;
        this.getApproach = getApproach;
        this.buildTagTree = buildTagTree;

        function getQualifications(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/tags/qual-areas'
            });
        }

        function getImpactArea(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/tags/impact-areas'
            });
        }

        function getApproach(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/tags/test-approaches'
            });
        }

        function buildTagTree(data){
            var treeData = [];
            var keylist = {}; 
            for (var i=0; i < data.length; i++){
                if (data[i]['IsActive'] === "1"){
                    keylist[data[i]['CategoryID']] = true;
                }
            }
            for (var i=0; i < data.length; i++){
                if (data[i]['IsActive'] === "1"){
                    var node = {};
                    node.id = data[i]['CategoryID'];
                    node.text = data[i]['CategoryName'];
                    if (keylist[data[i]['CategoryFatherID']]){
                        node.parent = data[i]['CategoryFatherID'];
                    } else{
                        node.parent = "#";
                    }
                    treeData.push(node);
                }
            }
            // console.log(treeData);
            return treeData;
        }

    }

})();
