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
                                    "type" => "testcasebyfolder"
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
        return $this->getALMTestCasesByFolderJson($almDatabase, $folderId);
    }

}

