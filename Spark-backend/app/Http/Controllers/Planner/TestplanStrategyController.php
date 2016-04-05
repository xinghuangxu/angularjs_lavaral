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
use Spark\Models\Planner\TestPlan;
use Spark\Models\TestStrategy;
use Spark\Models\DhtmlxUser;
use Spark\Utils\utilFunctions;
use \Auth;


class TestplanStrategyController extends Controller {
    /**
     * List of roles which are allowed to do actions from this controller
     * @type {array}
     */
    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");

    /***
     * Returns all Test Strategies directly associated with the testplan
     * @param testplan_id   Spark
     * @return Response
     */
    public function index(Request $request, $testplan_id) {

        /*
         *
         * the following line should be diabled in production to hit the right service
         *
         */

        $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.planner.testplans.id.teststrategies.json");
        return $data;

        $testplan = TestPlan::findOrFail($testplan_id);
        $result = $testplan->teststrategies()->with(
                'tagsQualArea',
                'tagsImpactArea',
                'tagsTestApproach')
            ->with(TestStrategy::strategyRequirements())
            ->get();
        return $result;
    }

    /***
     * Makes a new association between testplan and teststrategy
     * @param testplan_id   Spark
     * @return Response
     */
    public function store(Request $request, $testplan_id) {

        //Check User Permissions by Roles
        //User not authorized to do this action
        if($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;

        $testplan = TestPlan::findOrFail($testplan_id);
        try {
            $strategy_id = $request->input('StrategyID');
            if (!$strategy_id) {
                $topic_id = $request->input('TopicID');
                $strategy_id = TestStrategy::where('TopicID', '=', $topic_id)->get(['StrategyID']);
            }

            //Check if requested mapping exists.  If it does not then add it.
            if (!$testplan->teststrategies()->get()->contains($strategy_id)) {
                $testplan->teststrategies()->attach($strategy_id, ['created_by' => $currentUser]);
            }
        }
        catch (Exception $e) {
            $return['message'] = "Bad StrategyID: " . $e->getMessage();
            $return['action'] = "Association Failed";
            return response(json_encode($return), 400);  //400 = Bad request
        }

        $content = "Associated $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:$testplan->testplan_substack_id";
        $content .= " with $strategy_id";

        $return = [];
        $return['message'] = $content;
        $return['action'] = "Added Association";
        $return['release'] = $testplan->release_id;
        $return['stack'] = $testplan->testplan_stack_id;
        $return['boxcar'] = $testplan->testplan_boxcar_id;
        $return['substack'] = $testplan->testplan_substack_id;
        $return['strategyId'] = $strategy_id;

        return response(json_encode($return), 200);  //200 = OK response code
    }

    /***
     * Removes an association between testplan and teststrategy
     * @param testplan_id   Spark
     * @param strategy_id   Spark
     * @return Response
     */
    public function destroy(Request $request, $testplan_id, $strategy_id){

        //Check User Permissions by Roles
        //User not authorized to do this action
        if($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }

        $testplan = TestPlan::findOrFail($testplan_id);
        $strategy = TestStrategy::findOrFail($strategy_id);
        $testplan->teststrategies()->detach($strategy_id);

        $content = "Removed association $testplan->release_id:$testplan->testplan_stack_id:$testplan->testplan_boxcar_id:";
        $content .= "$testplan->testplan_substack_id";
        $content .= " with $strategy_id";

        $return = [];
        $return['message'] = $content;
        $return['action'] = "Removed Association";
        $return['release'] = $testplan->release_id;
        $return['stack'] = $testplan->testplan_stack_id;
        $return['boxcar'] = $testplan->testplan_boxcar_id;
        $return['substack'] = $testplan->testplan_substack_id;
        $return['strategyId'] = $strategy_id;

        return response(json_encode($return), 200);  //200 = OK response code
    }
}
?>
