<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\TestStrategy;
use Spark\Models\DhtmlxUser;
use Spark\Models\ALM\TestCase;
use Spark\Models\TestStrategyTestCase;
use Spark\Utils\utilFunctions;

class TestStrategyTestCaseController extends Controller {
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
     * Returns all suggested test cases and details associated with the test strategy
     *
     * @param
     *            testplan_id Spark
     * @return Response
     */
    public function index(Request $request, $strategy_id) {
        $strategy = TestStrategy::findOrFail($strategy_id);
        $result = $strategy->getSuggestedTestCasesAttribute();
        return json_encode($result);
    }

    /**
     * Makes a new suggested test cases association to test strategy
     *
     * @param testplan_id Spark
     * @return Response
     */
    public function store(Request $request, $strategy_id) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);
        }

        $strategy = TestStrategy::findOrFail($strategy_id);
        $testcase_id = $request->input('TS_TEST_ID');
        $alm = $request->input('almdb');
        // Correct missing _db from database name.
        if (! preg_match('/_db/g', $alm)) {
            $alm .= '_db';
        }
        // Check if test case is valid.
        $testcase = TestCase::from($alm)->findOrFail($testcase_id);

        // Check if requested mapping exists. If it does not then add it.
        if (! $strategy->suggestedTests()->where('TS_TEST_ID', '=', $testcase_id)->exists()) {
            $strategy->suggestedTests()->create([
                            'TS_TEST_ID' => $testcase_id,
                            'Domain' => $alm
            ]);
            // This would be appropriate if we can model the cross mapping table to the various ALM db correctly.
            // $strategy->suggestedTests()->attach($testcase_id, ['Domain' => $alm]);
        }

        $content = "Associated $strategy_id";
        $content .= " with $alm:$testcase_id";

        $return = [ ];
        $return ['message'] = $content;
        $return ['action'] = "Added Association";
        $return ['strategyId'] = $strategy_id;
        $return ['testcaseId'] = $testcase_id;

        return response(json_encode($return), 200); // 200 = OK response code
    }

    /**
     * Removes a suggested test cases association from the test strategy
     *
     * @param testplan_id Spark
     * @param strategy_id Spark
     * @return Response
     */
    public function destroy(Request $request, $strategy_id, $testcase_id) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);
            response($responseArrJson, $responseArr ["code"]);

            // Exit early so nothing else happens
            return;
        }

        $strategy = TestStrategy::findOrFail($strategy_id);
        // ignore the remote possibility that a strategy could have two recommened tests from separate ALM instances with the same id.
        $strategy->suggestedTests()->where('TS_TEST_ID', '=', $testcase_id)->delete();

        $content = "Removed association $strategy_id";
        $content .= " with $testcase_id";

        $return = [ ];
        $return ['message'] = $content;
        $return ['action'] = "Removed Association";
        $return ['strategyId'] = $strategy_id;
        $return ['testcaseId'] = $testcase_id;

        return response(json_encode($return), 200); // 200 = OK response code
    }
}
?>
