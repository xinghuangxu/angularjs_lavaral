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
use Spark\Models\ALM\TestCase;
use InvalidArgumentException;

class TestCasesByFolderController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     * Get the ALM TestCasesByFolder for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestCasesByFolder
     */
    public function getALMTestCasesByFolderResult($almDatabase, $folderId)
    {
        $testCasesByFolderResult = TestCase::from($almDatabase)->where('TS_SUBJECT', '=', $folderId)->get();

        return $testCasesByFolderResult;
    }

    /**
     * Build the ALM TestCasesByFolders for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestCasesByFolders as JSON for JSTREE
     */
    public function getALMTestCasesByFolderJson($almDatabase, $folderId)
    {
        $testCasesByFolderResult = $this->getALMTestCasesByFolderResult($almDatabase, $folderId);

        $listArr = array();

        for($k=0; $k < count($testCasesByFolderResult); $k++)
        {
            $testCaseType = $testCasesByFolderResult[$k]["TS_TYPE"];

            if($testCaseType == "MANUAL"){
                $icon = "glyphicon glyphicon-wrench";
            }else{
                $icon = "glyphicon glyphicon-cog";
            }

            $listArrEach = array(
                                    "id" => $testCasesByFolderResult[$k]["TS_TEST_ID"],
                                    "test_case_name" => $testCasesByFolderResult[$k]["TS_NAME"],
                                    "test_case_type" => $testCasesByFolderResult[$k]["TS_TYPE"],
                                    "icon" => $icon,
                                    "obj_type" => "testcasebyfolder"
                                );

            array_push($listArr, $listArrEach);
        }

        return response()->json($listArr);
    }

    /**
     * Get the ALM TestCasesByFolder for an ALM Database by FolderId
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestCasesByFolder List
     */
    public function show($almDatabase, $folderId) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.alm.databases.apg_qa_producttest_db.testcasesbyfolder.16546.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        return $this->getALMTestCasesByFolderJson($almDatabase, $folderId);
    }

}

