<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-12
 */

namespace Spark\Http\Controllers\ALM;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\ALM\TestCycle;
use Spark\Models\ALM\TestCase;
use InvalidArgumentException;

class TestCaseInstancesController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Get the ALM TestCaseInstances for an ALM Database
     *
     * @param String $almDatabase
     * @param String $testSetId
     * @return ALM TestCaseInstances
     */
    public function getALMTestCaseInstancesResult($almDatabase, $testSetId)
    {
        $testCaseInstanceResult = TestCycle::from($almDatabase)->where('TC_CYCLE_ID', '=', $testSetId)
                                    ->join($almDatabase.'.td.Test', 'TS_TEST_ID', '=', 'TC_TEST_ID')
                                    ->get();

        return $testCaseInstanceResult;
    }

    /**
     * Build the ALM TestCaseInstances for an ALM Database
     *
     * @param String $almDatabase
     * @param String $testSetId
     * @return ALM TestCaseInstances as JSON for JSTREE
     */
    public function getALMTestCaseInstancesJson($almDatabase, $testSetId)
    {
        $testCaseInstanceResult = $this->getALMTestCaseInstancesResult($almDatabase, $testSetId);

        $listArr = array();

        for($k=0; $k < count($testCaseInstanceResult); $k++)
        {
            $status = $testCaseInstanceResult[$k]["TC_STATUS"];

            $icon = "glyphicon glyphicon-record";

            switch ($status){

                case "Failed":
                    $icon = "glyphicon glyphicon-remove color_red1";
                    break;

                case "Blocked":
                case "External Hold":
                case "Hold":
                case "Not Completed":
                case "No Run":
                    $icon = "glyphicon glyphicon-minus color_gray1";
                    break;

                case "Passed":
                case "Restricted":
                case "N/A":
                case "NA":
                    $icon = "glyphicon glyphicon-ok color_green1";
                    break;

            }

            $listArrEach = array(
                                "id" => $testCaseInstanceResult[$k]["TC_TESTCYCL_ID"],
                                "test_instance" => $testCaseInstanceResult[$k]["TC_TEST_INSTANCE"],
                                "status" => $status,
                                "test_case_name" => $testCaseInstanceResult[$k]["TS_NAME"],
                                "test_case_path" => $testCaseInstanceResult[$k]["TS_PATH"],
                                "icon" => $icon,
                                "obj_type" => "testcaseinstance"
                            );

            array_push($listArr, $listArrEach);

        }

        return response()->json($listArr);
    }

    /**
     * Get the ALM TestCaseInstances for an ALM Database by TestSetId
     *
     * @param String $almDatabase
     * @param String $testSetId
     * @return ALM TestCaseInstances List
     */
    public function show($almDatabase, $testSetId) {

        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.alm.databases.apg_qa_producttest_db.testcaseinstances.51097.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        return $this->getALMTestCaseInstancesJson($almDatabase, $testSetId);
    }

}

