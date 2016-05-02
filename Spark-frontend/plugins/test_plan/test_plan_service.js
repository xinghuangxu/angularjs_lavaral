/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testPlan')
        .service('testPlanService',testPlanService);

    testPlanService.$inject=['$http', 'pluginNamesConstant'];

    function testPlanService($http, pluginNamesConstant){

        this.getTopList = getTopList;
        this.getTestPlanCategories = getTestPlanCategories;
        this.getTestCasesCategories = getTestCasesCategories;
        this.getTestcases = getTestcases;
        this.getTopListTree = getTopListTree;
        this.getTestPlanCategoriesTree = getTestPlanCategoriesTree;
        this.getTestCasesCategoriesTree = getTestCasesCategoriesTree;
        this.getTestcasesTree = getTestcasesTree;
        this.getArrangeBy = getArrangeBy;

        function getTopList(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer +'/rest/planner/tmptestplan/toplist'
            });
        }

        function getTestPlanCategories(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer +'/rest/planner/tmptestplan/tscategories'
            });
        }

        function getTestCasesCategories(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer +'/rest/planner/tmptestplan/tstestcases'
            });
        }

        function getTestcases(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer +'/rest/planner/tmptestplan'
            });
        }

        function getTopListTree(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.data = 'ts_cat',
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= true,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);
                treeJson.push(node);
            }
            return treeJson;
        }

        function getTestPlanCategoriesTree(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.data = 'tc_cat',
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= true,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);

                treeJson.push(node);
            }
            return treeJson;
        }

        function getTestCasesCategoriesTree(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.data = 'test_plan',
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= true,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);

                treeJson.push(node);
            }
            return treeJson;
        }

        function getTestcasesTree(data){
            var nodeJson = function(id, text, icon){
                this.id= id,
                    this.text=text,
                    this.icon= icon||null,
                    this.state= {
                        "opened": false,
                        "disabled": false,
                        "selected": false
                    },
                    this.children= false,
                    this.liAttributes= null,
                    this.aAttributes= null
            };

            var treeJson = [];
            var treeData = data.data;
            for (var i=0; i < treeData.length; i++){
                var node = new nodeJson(treeData[i].id,treeData[i].title,treeData[i].icon);

                treeJson.push(node);
            }
            return treeJson;
        }

        function getArrangeBy(){

        }

    }
})();
