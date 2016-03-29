/**
 * Unit test definition for Spark boxcar services
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-01
 *
 */

describe("Test spark.boxcar service", function() {
    var $q, boxcarTreeService;

    var rawData = [ {
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
        "QualArea": "Operational behavior,Second QualArea",
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
        angular.mock.module('spark');
        angular.mock.module('spark.planner');
        angular.mock.module('spark.planner.boxcar');

        angular.mock.inject(injector);

        injector.inject = [ '$q', 'boxcarTreeService' ];
        function injector(_$q_, _boxcarTreeService_) {
            $q = _$q_;
            boxcarTreeService = _boxcarTreeService_;
        }
    });

    it('should parse data correctly', function() {
        boxcarTreeService.parse(rawData);
        expect(boxcarTreeService.rawData).toBeDefined();
        expect(boxcarTreeService.rawData.length).toEqual(2);
        expect(boxcarTreeService.rawData[0].children.length).toEqual(10);
    });

    it('should build trees correctly', function() {
        boxcarTreeService.parse(rawData);

        boxcarTreeService.buildTree(boxcarTreeService.config.groupBy.NONE);
        expect(boxcarTreeService.data.length).toEqual(2);
        expect(boxcarTreeService.data[0].children.length).toEqual(10);

        boxcarTreeService.buildTree(boxcarTreeService.config.groupBy.REQUIREMENT);
        expect(boxcarTreeService.data.length).toEqual(1);
        expect(boxcarTreeService.data[0].children.length).toEqual(2);
    });
});