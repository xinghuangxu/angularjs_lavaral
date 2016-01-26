<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-07
 */
namespace Spark\Http\Controllers\ALM;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\ALM\Folder;
use InvalidArgumentException;

class ALMFolderController extends Controller {

    /**
     * Get the ALM Folder Children for an ALM Database
     *
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
            $childrenArrEach = array(
                                    "id" => $folderResult[$k]["CF_ITEM_ID"],
                                    "text" => $folderResult[$k]["CF_ITEM_NAME"],
                                    "hasChildren" => $this->getALMFoldersHasChildren($almDatabase, $folderResult[$k]["CF_ITEM_ID"]),
                                );

            array_push($childrenArr, $childrenArrEach);
        }

        return response()->json($childrenArr);
    }

    /**
     * Get the ALM Folder Children for an ALM Database by FolderId
     *
     * @param String $almDatabase
     * @param String $folderIdParam
     * @return ALM Folders Children
     */
    public function show($almDatabase, $id) {
        return $this->getALMFolderChildren($almDatabase, $id);
    }

}

