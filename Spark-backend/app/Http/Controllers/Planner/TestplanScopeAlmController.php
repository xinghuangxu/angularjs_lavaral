<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\Planner;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\Planner\TestPlan;
use Spark\Models\ScopeStrategyMapping;
use Spark\Models\Planner\TestplanScopeStrategyMapping;
use Spark\Models\Planner\TestcycleTestplanScopeStrategyMapping;
use Spark\Models\ALM\TestCycle;
use Spark\Models\ALM\TestCase;
use Spark\Models\ALM\Cycle;
use Spark\Models\DhtmlxUser;
use Spark\Utils\utilFunctions;

class TestplanScopeAlmController extends Controller {

    /**
     * List of roles which are allowed to do actions from this controller
     * @type {array}
     */
    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");

    /**
     * Returns all testCycles associated with the testplan+scopeStrategyMapping
     *
     * @param testplan_id Spark
     * @param scopeStrategyMapping_id Spark
     * @return Response
     */
    public function index(Request $request, $testplan_id, $scopeStrategyMapping_id) {
        $tpssm = TestplanScopeStrategyMapping::where('testplan_id', $testplan_id)->where('ScopeStrategyMappingID', $scopeStrategyMapping_id)->firstOrFail();
        $alm_db_name = $tpssm->testplan()->first()->alm_db_name;
        $cycleIds = TestcycleTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->get([
                        'tc_testcycle_id'
        ])->toArray();
        $result = TestCycle::from($alm_db_name)->whereIn('TC_TESTCYCL_ID', $cycleIds)->get()->all();
        // TODO rework to make classes for instances of ALM databases.
        return $result;
    }

    /**
     * Makes a new association between testplan+scopeStrategyMap and a test cycle (test case instance)
     *
     * @param testplan_id Spark
     * @param scopeStrategyMapping_id Spark
     * @return Response
     */
    public function store(Request $request, $testplan_id, $scopeStrategyMapping_id) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);;
        }

        // Find the association nexus based on TP and SSM.
        $testplan = TestPlan::findOrFail($testplan_id);
        $alm_db_name = $testplan->alm_db_name;
        $scopeStraetgyMapping = ScopeStrategyMapping::findOrFail($scopeStrategyMapping_id);
        $tpssm = TestplanScopeStrategyMapping::where('testplan_id', $testplan_id)->where('ScopeStrategyMappingID', $scopeStrategyMapping_id)->firstOrFail();
        // Verify TestCycle for given id exists and has valid ALM content.
        $tc_testcycle_id = $request->input('tc_testcycle_id');
        $testCycle = TestCycle::from($alm_db_name)->findOrFail($tc_testcycle_id);
        $cycle = Cycle::from($alm_db_name)->findOrFail($testCycle->TC_CYCLE_ID);
        $testCase = TestCase::from($alm_db_name)->findOrFail($testCycle->TC_TEST_ID);
        // Make the association if it does not already exist.
        if (empty(TestcycleTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->where('tc_testcycle_id', '=', $tc_testcycle_id)->first())) {
            TestcycleTestplanScopeStrategyMapping::insert([
                            'tpssm_id' => $tpssm->id,
                            'tc_testcycle_id' => $tc_testcycle_id,
                            'created_by' => $currentUser->ssoName,
                            'updated_by' => $currentUser->ssoName
            ]);
        }

        $content = "Associated $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:$testplan->testplan_substack_id";
        $content .= " + $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";
        $content .= " with $cycle->CY_CYCLE -> $testCase->TS_NAME";

        $return = [ ];
        $return ['message'] = $content;
        $return ['action'] = "Added Association";
        $return ['release'] = $testplan->release_id;
        $return ['stack'] = $testplan->testplan_stack_id;
        $return ['boxcar'] = $testplan->testplan_boxcar_id;
        $return ['substack'] = $testplan->testplan_substack_id;
        $return ['reqType'] = $scopeStraetgyMapping->RequirementType;
        $return ['reqId'] = $scopeStraetgyMapping->RequirementID;
        $return ['phase'] = $scopeStraetgyMapping->ScopePhase;
        $return ['strategyId'] = $scopeStraetgyMapping->StrategyID;
        $return ['testSetId'] = $cycle->CY_CYCLE;
        $return ['testCaseName'] = $testCase->TS_NAME;

        return response(json_encode($return), 200); // 200 = OK status code
    }

    /**
     * Removes an association between testplan+scopeStrategyMap and a test cycle (test case instance)
     *
     * @param testplan_id Spark
     * @param scopeStrategyMapping_id Spark
     * @param tc_testcycle_id ALM
     * @return Response
     */
    public function destroy(Request $request, $testplan_id, $scopeStrategyMapping_id, $tc_testcycle_id) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);
        }

        $tpssm = TestplanScopeStrategyMapping::where('testplan_id', $testplan_id)->where('ScopeStrategyMappingID', $scopeStrategyMapping_id)->firstOrFail();
        TestcycleTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->where('tc_testcycle_id', '=', $tc_testcycle_id)->delete();
        $testplan = TestPlan::find($testplan_id);
        $alm_db_name = $testplan->alm_db_name;
        $scopeStraetgyMapping = ScopeStrategyMapping::find($scopeStrategyMapping_id);
        $testCycle = TestCycle::from($alm_db_name)->find($tc_testcycle_id);
        $cycle = Cycle::from($alm_db_name)->find($testCycle->TC_CYCLE_ID);
        $testCase = TestCase::from($alm_db_name)->find($testCycle->TC_TEST_ID);

        $content = "Removed association $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:";
        $content .= "$testplan->testplan_substack_id";
        $content .= " + $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";
        $content .= " with $cycle->CY_CYCLE -> $testCase->TS_NAME";

        $return = [ ];
        $return ['message'] = $content;
        $return ['action'] = "Removed Association";
        $return ['release'] = $testplan->release_id;
        $return ['stack'] = $testplan->testplan_stack_id;
        $return ['boxcar'] = $testplan->testplan_boxcar_id;
        $return ['substack'] = $testplan->testplan_substack_id;
        $return ['reqType'] = $scopeStraetgyMapping->RequirementType;
        $return ['reqId'] = $scopeStraetgyMapping->RequirementID;
        $return ['phase'] = $scopeStraetgyMapping->ScopePhase;
        $return ['strategyId'] = $scopeStraetgyMapping->StrategyID;
        $return ['testSetId'] = $cycle->CY_CYCLE;
        $return ['testCaseName'] = $testCase->TS_NAME;

        return response(json_encode($return), 200); // 200 = OK status code
    }
}
