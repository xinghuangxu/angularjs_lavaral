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
use Spark\Models\ALM\TestSet;
use InvalidArgumentException;

class TestSetController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Get the ALM TestSets for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestSets
     */
    public function getALMTestSetResult($almDatabase, $folderId)
    {
        $testSetResult = TestSet::from($almDatabase)->where('CY_FOLDER_ID', '=', $folderId)->get();

        return $testSetResult;
    }

    /**
     * Build the ALM TestSets for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestSets as JSON for JSTREE
     */
    public function getALMTestSetJson($almDatabase, $folderId)
    {
        $testSetResult = $this->getALMTestSetResult($almDatabase, $folderId);

        $listArr = array();

        for($k=0; $k < count($testSetResult); $k++)
        {
            $listArrEach = array(
                                    "id" => $testSetResult[$k]["CY_CYCLE_ID"],
                                    "title" => $testSetResult[$k]["CY_CYCLE"],
                                    "icon" => "glyphicon glyphicon-tasks",
                                    "obj_type" => "testset"
                                );

            array_push($listArr, $listArrEach);
        }

        return response()->json($listArr);
    }

    /**
     * Get the ALM TestSet for an ALM Database by FolderId
     *
     * @param String $almDatabase
     * @param String $folderId
     * @return ALM TestSet List
     */
    public function show($almDatabase, $folderId) {

        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.alm.databases.apg_qa_producttest_db.testsets.532.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        return $this->getALMTestSetJson($almDatabase, $folderId);
    }

}

