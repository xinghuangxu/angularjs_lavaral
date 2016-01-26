<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2015-12-14
 */
namespace Spark\Http\Controllers\Planner;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\Planner\TestPlan;
use Spark\Models\ScopeStrategyMapping;
use Spark\Models\Planner\TestplanScopeStrategyMapping;
use Spark\Models\DhtmlxUser;
use Spark\Utils\utilFunctions;

class TestplanScopeStrategyMappingsController extends Controller {

    /**
     * List of roles which are allowed to do actions from this controller
     * @type {array}
     */
    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");

    /**
     * Returns all scopeStrategyMaps associated with the testplan
     *
     * @param testplan_id Spark
     * @return Response
     */
    public function index(Request $request, $testplan_id) {
        $testplan = TestPlan::findOrFail($testplan_id);
        $result = $testplan->scopeStrategyMappings()->get();
        return $result;
    }

    /**
     * Show the list of strategy mappings
     *
     * @param Request $request
     * @param unknown $testplan_id
     * @param unknown $ScopeStrategyMappingID
     */
    public function show(Request $request, $testplan_id, $ScopeStrategyMappingID) {
        return TestplanScopeStrategyMapping::where('testplan_id', '=', $testplan_id)->where('ScopeStrategyMappingID', '=', $ScopeStrategyMappingID)->firstOrFail();
    }

    /**
     * Makes a new association between testplan and scopeStrategyMap
     *
     * @param testplan_id Spark
     * @return Response
     */
    public function store(Request $request, $testplan_id) {
        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }

        $testplan = TestPlan::findOrFail($testplan_id);
        $scopeStrategyMapping_id = $request->input('ScopeStrategyMappingID');
        $scopeStraetgyMapping = ScopeStrategyMapping::findOrFail($scopeStrategyMapping_id);
        // Check if requested mapping exists. If it does not then add it.
        if (! $testplan->scopeStrategyMappings->contains($scopeStrategyMapping_id)) {
            $testplan->scopeStrategyMappings()->attach($scopeStrategyMapping_id, [
                            'created_by' => $currentUser->ssoName,
                            'updated_by' => $currentUser->ssoName
            ]);
        }

        $content = "Associated $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:$testplan->testplan_substack_id";
        $content .= " with $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";

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

        return response(json_encode($return), 200); // 200 = OK response code
    }

    /**
     * Removes an association between testplan and scopeStrategyMap
     *
     * @param testplan_id Spark
     * @param scopeStrategyMapping_id Spark
     * @return Response
     */
    public function destroy(Request $request, $testplan_id, $scopeStrategyMapping_id) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }

        $testplan = TestPlan::findOrFail($testplan_id);
        $scopeStraetgyMapping = ScopeStrategyMapping::findOrFail($scopeStrategyMapping_id);
        $testplan->scopeStrategyMappings()->detach($scopeStrategyMapping_id);

        $content = "Removed association $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:";
        $content .= "$testplan->testplan_substack_id";
        $content .= " with $scopeStraetgyMapping->RequirementType:$scopeStraetgyMapping->RequirementID:";
        $content .= "$scopeStraetgyMapping->ScopePhase:$scopeStraetgyMapping->StrategyID";

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

        return response(json_encode($return), 200); // 200 = OK response code
    }
}
