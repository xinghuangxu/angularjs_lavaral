<?php

/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */
namespace Spark\Http\Controllers\Planner;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;
use Spark\Models\TestStrategy;
use Spark\Models\Planner\TestPlan;
use Spark\Models\Planner\TestPlanTestStrategy;
use Spark\Utils\utilFunctions;
use Carbon\Carbon;
use \Auth;
use \Exception;

class TestplanScopesController extends Controller {

    /**
     * List of roles which are allowed to do actions from this controller
     * @type {array}
     */
    protected static $rolesAllowed = array (
        "TATT",
        "QA_Rev",
        "QA_Eng",
        "RQA_Eng",
        "RQA_Eng"
    );

    /**
     * *
     * Provide a list of testplan strategies with scope data
     * @param integer $testplan_id
     * @return Response
     */
    public function index(Request $request, $testplan_id) {
        
        /**
         * The Following two lines is for integrations work only 
         */
        $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.planner.testplans.id.teststrategies.json");
        return $data;

        $plan = TestPlan::findOrFail($testplan_id);

        //Base laraevl query
        $query = TestPlanTestStrategy::with([
                'testplan' => function($q) {
                    $q->select('id', 'release_id', 'testplan_stack_id', 'testplan_substack_id', 'testplan_boxcar_id');
                },
                'testplan.stack',
                'testplan.substack',
                'teststrategy' => function($q) {
                    $q->select('StrategyID', 'StrategyHeadline');
                }])
                ->select(['id', 'updated_at', 'updated_by', 'priority', 'scope', 'risk', 'leverage', 'testplan_id', 'StrategyID']);

        //
        if($plan->testplan_stack_id === null && $plan->testplan_substack_id === null){
            $query = $query->whereHas('testplan', function($q) use($plan) {
                $q->where('release_id', 'like', $plan->release_id);
            });
        } else if ($plan->testplan_substack_id === null) {
            $query = $query->whereHas('testplan', function($q) use($plan) {
                $q->where('release_id', 'like', $plan->release_id)
                  ->where('testplan_stack_id', '=', $plan->testplan_stack_id)
                  ->where('testplan_boxcar_id', 'like', $plan->testplan_boxcar_id);
            });
        } else {
            $query = $query->whereHas('testplan', function($q) use($testplan_id) {
                $q->where('testplan_id', '=', $testplan_id);
            });
        }

        return $query->get();
    }


    /**
     *
     * @param Request $request
     * @param integer $testplan_id
     * @param integer $testplanStrategy_id
     * @return void|unknown
     */
    public function update(Request $request, $testplan_id, $testplanStrategy_id) {
        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);
        }
        $currentUser = Auth::user()->username;

        //Check the datatime to see if there is a mismatch
        $scope = TestPlanTestStrategy::findOrFail($testplanStrategy_id);
        $input = new Carbon($request->input('updated_at'));
        if($scope->updated_at != $input) {
            $errorMessage = "There is a conflicting version of this scoping data in the database.  Please update using the latest information.";
            return response()->json(['error' => $errorMessage, 'scopeMap' => $this->index($request, $testplan_id)], 409); //409 = mismatch
        }

        $scope->fill($request->except(['']));
        $scope->updated_by = $currentUser;
        $scope->saveWithHistory();

    }
}
