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
use Spark\Models\ALM\TestCaseFolder;
use InvalidArgumentException;

class TestCaseFoldersController extends Controller {

    /**
     * Get the ALM TestCaseFolder Children for an ALM Database
     *
     * @param Request $request
     * @param String $almDatabase
     * @return ALM Folders Children
     * @throws \Spark\ALM\InvalidAlmDatabaseException
     */
    public function index(Request $request, $almDatabase) {

        // FolderId parameter
        $folderIdParam = 0;

        return $this->getALMTestCaseFolderChildren($almDatabase, $folderIdParam);
    }

    /**
     * Get the ALM TestCaseFolder for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM TestCaseFolder as JSON for JSTREE
     */
    public function getALMTestCaseFolderChildren($almDatabase, $folderIdParam)
    {
        $folderResult = $this->getALMTestCaseFolderResult($almDatabase, $folderIdParam);

        $childrenArr = array();

        for($k=0; $k < count($folderResult); $k++)
        {
            $hasChildren = $this->getALMTestCaseFolderHasChildren($almDatabase, $folderResult[$k]["AL_ITEM_ID"]);

            if($hasChildren == true){
                $icon = "glyphicon glyphicon-folder-open";
            }else{
                $icon = "glyphicon glyphicon-folder-close";
            }

            $childrenArrEach = array(
                                    "id" => $folderResult[$k]["AL_ITEM_ID"],
                                    "text" => $folderResult[$k]["AL_DESCRIPTION"],
                                    "hasChildren" => $hasChildren,
                                    "icon" => $icon,
                                    "type" => "testcasefolder"
                                );

            array_push($childrenArr, $childrenArrEach);
        }

        return response()->json($childrenArr);
    }

    /**
     * Get the ALM TestCaseFolder for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM Folders
     */
    public function getALMTestCaseFolderResult($almDatabase, $folderIdParam)
    {
        $folderResult = TestCaseFolder::from($almDatabase)->where('AL_FATHER_ID', '=', $folderIdParam)->get();

        return $folderResult;
    }

    /**
     * Check if the ALM TestCaseFolder have children
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return boolean
     */
    public function getALMTestCaseFolderHasChildren($almDatabase, $folderIdParam)
    {
        $folderResult = TestCaseFolder::from($almDatabase)->where('AL_FATHER_ID', '=', $folderIdParam)->get();

        $has_children = false;
        if(count($folderResult) > 0){
            $has_children = true;
        }

        return $has_children;
    }

    /**
     * Get the ALM TestCaseFolder Children for an ALM Database by FolderId
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM TestCaseFolder Children
     */
    public function show($almDatabase, $folderIdParam) {
        return $this->getALMTestCaseFolderChildren($almDatabase, $folderIdParam);
    }

}

