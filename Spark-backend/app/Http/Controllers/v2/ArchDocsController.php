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
use Spark\Models\CQ\Reqx;
use Spark\Models\CQ\ReqxCache;

class ArchDocsController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     * Provide a list of ArchDocs Topics
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.v2.requirements.archdocs.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        // Boxcar parameter
        $boxcarIdParam = $request->input('boxcar_id');

        // Reqx parameter
        $reqxIdParam = $request->input('reqx_id');

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

        $query = ArchDoc::with('reqxs','boxcars');

        if (strlen($searchParam) > 0) { // Search parameter
            $match = "%$searchParam%";
            $query = $query->where('doc_title', 'like', $match)
                            ->orWhere('doc_filename', 'like', $match)
                            ->orWhere('doc_id', 'like', $match)
                            ->orWhere('doc_number', 'like', $match)
                            ->orWhere('doc_keyword', 'like', $match);
        }

        if (strlen($boxcarIdParam) > 0) { // boxcar_id parameter
            $query = $this->searchBoxcars($query, $boxcarIdParam);
        }

        if (strlen($reqxIdParam) > 0) { // reqx_id parameter
            $query = $this->searchReqxs($query, $reqxIdParam);
        }

        $query = $query->orderBy('doc_title', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $query = $query->paginate($perPage);
        } else {
            $query = $query->get();
        }


        return $query;
    }

    public function show($id) {
        return ArchDoc::with('reqxs','boxcars')->findOrFail($id);
    }

    /**
     * Search ReqxID Param relationship
     *
     * @param $query (Laravel Query Object)
     * @param $reqxIdParam Array
     * @return $query (Laravel Query Object)
     */
    public function searchReqxs($query, $reqxIdParam)
    {

        $query = $query->whereHas('Reqxs', function($q) use ($reqxIdParam)
        {
            $q = $q->where(function ($q) use ($reqxIdParam)
            {
                //$ReqxModel = new ReqxCache();
                //$ReqxModel = new Reqx();
                //$ReqxModelTableName = $ReqxModel->getTable();

                //$q = $q->where($ReqxModelTableName.'.reqx_id', '=', $reqxParam);

                $q = $q->where('id', '=', $reqxIdParam);
            });
        });

        return $query;
    }

    /**
     * Search BoxcarID Param relationship
     *
     * @param $query (Laravel Query Object)
     * @param $boxcarIdParam Array
     * @return $query (Laravel Query Object)
     */
    public function searchBoxcars($query, $boxcarIdParam)
    {

        $query = $query->whereHas('Boxcars', function($q) use ($boxcarIdParam)
        {
            $q = $q->where(function ($q) use ($boxcarIdParam)
            {
                $q = $q->where('id', '=', $boxcarIdParam);
            });
        });

        return $query;
    }


}
