<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-04-05
 */

namespace Spark\Http\Controllers\v2;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\v2\Tag;
use Spark\Models\v2\TagStructure;
use Spark\Models\v2\TagGroup;
use Spark\Models\v2\TagAlias;

class TagsController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Provide a list of Tags
     *
     * @param $request
     * @param String $tagGroupId
     * @param String $tagId (optional)
     * @return Response
     */
    public function index(Request $request, $tagGroupId, $tagId = null) {

        return $this->getTagsJson($tagGroupId, $tagId);

    }


    /**
     * Get the Tags Json
     *
     * @param String $tagGroupId
     * @param String $tagId (optional)
     * @return Tags as JSON
     */
    public function getTagsJson($tagGroupId, $tagId = null)
    {
        $tagsResult = $this->getTagsResult($tagGroupId, $tagId);

        $childrenArr = array();

        for($k=0; $k < count($tagsResult); $k++)
        {
            $hasChildren = $this->getTagHasChildren($tagsResult[$k]["tag_id"]);

            if($hasChildren == true){
                $icon = "glyphicon glyphicon-folder-open";
            }else{
                $icon = "glyphicon glyphicon-folder-close";
            }

            $childrenArrEach = array(
                                    "id" => $tagsResult[$k]["tag_id"],
                                    "tag_name" => $tagsResult[$k]["tag_name"],
                                    "tag_parent_id" => $tagsResult[$k]["tag_parent_id"],
                                    "tag_group_id" => $tagsResult[$k]["tag_group_id"],
                                    "tag_group_name" => $tagsResult[$k]["tag_group_name"],
                                    "has_children" => $hasChildren,
                                    "icon" => $icon,
                                    "obj_type" => "tag"
                                );

            array_push($childrenArr, $childrenArrEach);
        }

        return response()->json($childrenArr);
    }

    /**
     * Get the Tags
     *
     * @param String $tagGroupId
     * @param String $tagId (optional)
     * @return Tags
     */
    public function getTagsResult($tagGroupId, $tagId = null)
    {

        if(strlen($tagId) > 0)
        {
            $tagsResult = Tag::join('dbo.tags_structure', 'dbo.tags.id', '=', 'dbo.tags_structure.tag_id')
                             ->join('dbo.tags_groups', 'dbo.tags_structure.tag_group_id', '=', 'dbo.tags_groups.id')
                             ->where('tag_group_id', '=', $tagGroupId)
                             ->where('tag_parent_id', '=', $tagId)
                             ->get();
        }
        else
        {
            $tagsResult = Tag::join('dbo.tags_structure', 'dbo.tags.id', '=', 'dbo.tags_structure.tag_id')
                             ->join('dbo.tags_groups', 'dbo.tags_structure.tag_group_id', '=', 'dbo.tags_groups.id')
                             ->where('tag_group_id', '=', $tagGroupId)
                             ->get();
        }


        return $tagsResult;
    }

    /**
     * Check if the Tags have children
     *
     * @param String $tagId
     * @return boolean
     */
    public function getTagHasChildren($tagId)
    {
        $tagsResult = Tag::where('tag_parent_id', '=', $tagId)
                          ->join('dbo.tags_structure', 'dbo.tags.id', '=', 'dbo.tags_structure.tag_id')
                          ->join('dbo.tags_groups', 'dbo.tags_structure.tag_group_id', '=', 'dbo.tags_groups.id')
                          ->get();

        $hasChildren = false;
        if(count($tagsResult) > 0){
            $hasChildren = true;
        }

        return $hasChildren;
    }



}
