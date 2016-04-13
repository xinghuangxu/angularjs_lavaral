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
use Spark\Models\ALM\Folder;
use InvalidArgumentException;

class FolderController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Get the ALM Folder Children for an ALM Database
     *
     * @param Request $request
     * @param String $almDatabase
     * @return ALM Folders Children
     * @throws \Spark\ALM\InvalidAlmDatabaseException
     */
    public function index(Request $request, $almDatabase) {

        // FolderId parameter
        $folderIdParam = 0;

        return $this->getALMFolderChildren($almDatabase, $folderIdParam);
    }

    /**
     * Get the ALM Folders for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM Folders as JSON for JSTREE
     */
    public function getALMFolderChildren($almDatabase, $folderIdParam)
    {
        $folderResult = $this->getALMFoldersResult($almDatabase, $folderIdParam);

        $childrenArr = array();

        for($k=0; $k < count($folderResult); $k++)
        {
            $hasChildren = $this->getALMFoldersHasChildren($almDatabase, $folderResult[$k]["CF_ITEM_ID"]);

            if($hasChildren == true){
                $icon = "glyphicon glyphicon-folder-open";
            }else{
                $icon = "glyphicon glyphicon-folder-close";
            }

            $childrenArrEach = array(
                                    "id" => $folderResult[$k]["CF_ITEM_ID"],
                                    "text" => $folderResult[$k]["CF_ITEM_NAME"],
                                    "hasChildren" => $hasChildren,
                                    "icon" => $icon,
                                    "obj_type" => "folder"
                                );

            array_push($childrenArr, $childrenArrEach);
        }

        return response()->json($childrenArr);
    }

    /**
     * Get the ALM Folders for an ALM Database
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM Folders
     */
    public function getALMFoldersResult($almDatabase, $folderIdParam)
    {
        $folderResult = Folder::from($almDatabase)->where('CF_FATHER_ID', '=', $folderIdParam)->get();

        return $folderResult;
    }

    /**
     * Check if the ALM Folders have children
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return boolean
     */
    public function getALMFoldersHasChildren($almDatabase, $folderIdParam)
    {
        $folderResult = Folder::from($almDatabase)->where('CF_FATHER_ID', '=', $folderIdParam)->get();

        $has_children = false;
        if(count($folderResult) > 0){
            $has_children = true;
        }

        return $has_children;
    }

    /**
     * Get the ALM Folder Children for an ALM Database by FolderId
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM Folders Children
     */
    public function show($almDatabase, $folderIdParam) {

        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.alm.databases.apg_qa_producttest_db.folder.510.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        return $this->getALMFolderChildren($almDatabase, $folderIdParam);
    }

}

