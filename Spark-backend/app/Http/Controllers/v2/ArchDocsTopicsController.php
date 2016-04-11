<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-15
 */

namespace Spark\Http\Controllers\v2;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\v2\ArchDoc;
use Spark\Models\v2\ArchDocTopic;

class ArchDocsTopicsController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     * Provide a list of Archdocs Topics
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request, $archdocId) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.v2.requirements.archdocs.1.topics.json");
            return response($data)->header('Content-Type', 'application/json');
        }

         // If this is called as a child resource of a archdoc, return only topics for that archdoc
        if ($archdocId) {
            $query = ArchDoc::findOrFail($archdocId)->Topics();
        } else {
            $query = ArchDocTopic::query();
        }

        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or all details
        $getFilter = "*";
        if (strlen($fieldsParam) > 0) {
            $getFilter = explode(',', $fieldsParam);
        }

        // results per page parameter
        $perPageParam = $request->input('perpage');
        $perPage = "50";
        if (strlen($perPageParam) > 0) {
            $perPage = $perPageParam;
        }

        // Search parameter
        $searchParam = $request->input('search');

        if (strlen($searchParam) > 0) { // Search parameter
            $match = "%$searchParam%";
            $query = $query->where('topic_id', 'like', $match)
                           ->orWhere('topic_name', 'like', $match);
        }

        $query = $query->orderBy('topic_name', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $query = $query->paginate($perPage);
        } else {
            $query = $query->get();
        }

        return $query;
    }

    public function show($id) {
        return ArchDocTopic::query()->findOrFail($id);
    }
}
