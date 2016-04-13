/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testStrategy')
        .service('testStrategyService',testStrategyService);

    testStrategyService.$inject= ['$http', 'pluginNamesConstant'];

    function testStrategyService($http, pluginNamesConstant){

        this.getTestStrategies = getTestStrategies;
        this.getTreeJson = getTreeJson;
        // Start of Implementation
        function getTestStrategies(type,search){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/',
                params:{
                    fields:'StrategyID,StrategyHeadline,State,Owner,ModifiedDate',
                    perpage:'all',
                    type:type,
                    search:search

                }
            });
        }
        function treeNode(id,parent,text) {
            this.id = id;
            this.parent = parent;
            this.text = text;
        }
        function getTreeJson(test_strategies){
            var tree_json=[];
            for(var i =0;i<test_strategies.length;i++)
            {
                var root_node=new treeNode(parseInt(test_strategies[i]['StrategyID']),'#',test_strategies[i]['StrategyHeadline']);
                tree_json.push(root_node);
                for(var attr in test_strategies[i] )
                {
                    var child=new treeNode(
                        parseInt(test_strategies[i]['StrategyID'])+attr,
                        parseInt(test_strategies[i]['StrategyID']),
                        test_strategies[i][attr]
                    );
                    tree_json.push(child);
                }


            }
            return tree_json;

        }


    }
})();
