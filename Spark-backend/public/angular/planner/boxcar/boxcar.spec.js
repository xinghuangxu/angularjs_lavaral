/**
 * Unit test definition for Spark test planner boxcar pane controller
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-01
 *
 */

describe("Test spark.planner.boxcar controller", function() {
    var $rootScope, $controller, $q, boxcarTreeService, boxcarScopeService, testplanSettingsService;

    beforeEach(function() {
       angular.mock.module('spark');
       angular.mock.module('spark.boxcar');
       angular.mock.module('spark.planner');
       angular.mock.module('spark.planner.boxcar');

       angular.mock.inject(injector);

       injector.inject = [ '$rootScope', '$controller', '$q', 'boxcarTreeService', 'boxcarScopeService', 'testplanSettingsService' ];
       function injector(_$rootScope_, _$controller_, _$q_, _boxcarTreeService_, _boxcarScopeService_, _testplanSettingsService_) {
           $rootScope = _$rootScope_;
           $controller = _$controller_;
           $q = _$q_;
           boxcarTreeService = _boxcarTreeService_;
           boxcarScopeService = _boxcarScopeService_;
           testplanSettingsService = _testplanSettingsService_;
       }
    });

    describe("Test controller", function() {
        var controller;

        var scopeData = [ {
            "Boxcar": "LSIP200000229",
            "ReqxType": "PR",
            "ReqxID": "LSIP200000065",
            "ReqxTitle": "DML - SANtricity AMW GUI integration",
            "ScopeID": "28",
            "StrategyHeadline": "Placeholder: Operational behavior",
            "StrategyID": "125",
            "TopicID": "T-2013-07-29T14:42:06-RPVCEW3IWD",
            "TopicRev": "0",
            "Type": "P",
            "ScopePhase": "HighLevel",
            "ScopeSize": "5",
            "Priority": "P0 ",
            "RiskMultiplier": "1.5",
            "Complexity": "Very Low",
            "Leverage": "Share",
            "RITSize": "20",
            "QualArea": "Operational behavior",
            "ImpactArea": "Global"
        }, {
            "Boxcar": "LSIP200000229",
            "ReqxType": "PR",
            "ReqxID": "LSIP200000065",
            "ReqxTitle": "DML - SANtricity AMW GUI integration",
            "ScopeID": "28",
            "StrategyHeadline": "Placeholder: Error handling and recovery",
            "StrategyID": "126",
            "TopicID": "T-2013-07-29T14:42:33-BYURBLJW3S",
            "TopicRev": "0",
            "Type": "P",
            "ScopePhase": "HighLevel",
            "ScopeSize": "7988",
            "Priority": "P0 ",
            "RiskMultiplier": "1",
            "Complexity": "Low",
            "Leverage": "Own",
            "RITSize": "",
            "QualArea": "Error handling and recovery",
            "ImpactArea": "Global"
        } ];

        beforeEach(function() {
            sinon.stub(boxcarScopeService, 'get', function() {
                var deferred = $q.defer();
                deferred.resolve(scopeData);
                return { $promise: deferred.promise };
            });

            controller = $controller('Boxcar', {$scope: $rootScope.$new()});
            $rootScope.$apply();
        });

        it('should be created', function() {
            expect(controller).toBeDefined();
        });

        it('should have empty data', function() {
            expect(controller.config).toEqual(boxcarTreeService.config);
            expect(controller.tree).toEqual(boxcarTreeService.data);
            expect(controller.settings).toEqual(testplanSettingsService.data);
        });

        it('should request data', function() {
            controller.settings.testplan_stack_id = "My Stack Layer";
            $rootScope.$apply();

            expect(boxcarScopeService.get.called).toBeFalsy();

            controller.settings.testplan_stack_id = "LSIP2XXXX";
            $rootScope.$apply();

            expect(boxcarScopeService.get.called).toBeTruthy();
            expect(boxcarTreeService.rawData).toBeDefined();
        });

        it('should rebuild the tree', function() {
            controller.settings.testplan_stack_id = "LSIP2XXXX";
            $rootScope.$apply();
            expect(controller.tree.length).toEqual(1);
            expect(controller.tree[0].type).toEqual(NodeType.REQUIREMENT);

            controller.config.activeGroup = controller.config.groupBy.NONE;
            $rootScope.$apply();
            expect(controller.tree.length).toEqual(2);
            expect(controller.tree[0].type).toEqual(NodeType.TEST_STRATEGY);
        })
    });
});