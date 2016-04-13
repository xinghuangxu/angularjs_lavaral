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
use Spark\Models\Planner\RallyTestplanScopeStrategyMapping;
use Spark\Models\DhtmlxUser;
use Spark\Utils\utilFunctions;

class TestplanScopeRallyController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


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
        $userStories = RallyTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->get([
                        'userStory'
        ])->toArray();
        return $userStories;
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
            return response($responseArrJson, $responseArr["code"]);
        }

        // Find the association nexus based on TP and SSM.
        $testplan = TestPlan::findOrFail($testplan_id);
        $scopeStraetgyMapping = ScopeStrategyMapping::findOrFail($scopeStrategyMapping_id);
        $tpssm = TestplanScopeStrategyMapping::where('testplan_id', $testplan_id)->where('ScopeStrategyMappingID', $scopeStrategyMapping_id)->firstOrFail();
        // Verify TestCycle for given id exists and has valid ALM content.
        $userStory = $request->input('userStory');
        // TODO validate that this user story exists in Rally.

        // Make the association if it does not already exist.
        if (empty(RallyTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->where('userStory', '=', $userStory)->first())) {
            RallyTestplanScopeStrategyMapping::insert([
                            'tpssm_id' => $tpssm->id,
                            'userStory' => $userStory,
                            'created_by' => $currentUser->ssoName,
                            'updated_by' => $currentUser->ssoName
            ]);
        }

        $content = "Associated $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:$testplan->testplan_substack_id";
        $content .= " + $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";
        $content .= " with $userStory";

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
        $return ['userStory'] = $userStory;

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
    public function destroy(Request $request, $testplan_id, $scopeStrategyMapping_id, $userStory) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }

        $tpssm = TestplanScopeStrategyMapping::where('testplan_id', $testplan_id)->where('ScopeStrategyMappingID', $scopeStrategyMapping_id)->firstOrFail();
        RallyTestplanScopeStrategyMapping::where('tpssm_id', '=', $tpssm->id)->where('userStory', '=', $userStory)->delete();
        $testplan = TestPlan::find($testplan_id);
        $scopeStraetgyMapping = ScopeStrategyMapping::find($scopeStrategyMapping_id);

        $content = "Removed association $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:";
        $content .= "$testplan->testplan_substack_id";
        $content .= " + $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";
        $content .= " with $userStory";

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
        $return ['userStory'] = $userStory;

        return response(json_encode($return), 200); // 200 = OK status code
    }
}
