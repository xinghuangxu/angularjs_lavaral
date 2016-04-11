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
use Spark\Models\Tag;

class TagsController extends Controller {

    /**
     * Provide a list of Tags
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {
        $query = $this->getTags($request);

        return $query;
    }

    /**
     * Provide a list of Qualification Area Tags
     *
     * @param $request
     * @return Response
     */
    public function getQualAreas(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.tags.qual-areas.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $tagType = "Root\Default\Qualification Areas%";

        $query = $this->getTags($request, $tagType);

        return $query;
    }

    /**
     * Provide a list of Impact Area Tags
     *
     * @param $request
     * @return Response
     */
    public function getImpactAreas(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.tags.impact-areas.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $tagType = "Root\Feature%";

        $query = $this->getTags($request, $tagType);

        return $query;
    }

    /**
     * Provide a list of Test Strategy Approach Tags
     *
     * @param $request
     * @return Response
     */
    public function getTestStrategyApproaches(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.tags.test-approaches.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $tagType = "Root\Default\Test Strategy Approach%";

        $query = $this->getTags($request, $tagType);

        return $query;
    }

    /**
     *
     * @param Request $request
     * @param string $tagType
     * @return \Illuminate\Routing\Route
     */
    private function getTags(Request $request, $tagType = "") {
        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or all details
        $getFilter = "*";
        if (strlen($fieldsParam) > 0) {
            $getFilter = explode(',', $fieldsParam);
        }

        // Search parameter
        $searchParam = $request->input('search');

        if (strlen($tagType) > 0) {
            $query = Tag::query()->where('CategoryPath', 'like', $tagType);
        } else {
            $query = Tag::query();
        }

        if (strlen($searchParam) > 0) {
            $match = "%$searchParam%";
            $query = $query->where('CategoryName', 'like', $match)->orWhere('CategoryPath', 'like', $match);
        }

        $query = $query->orderBy('CategoryName', 'ASC')->select($getFilter);

        $query = $query->get();

        return $query;
    }
}
