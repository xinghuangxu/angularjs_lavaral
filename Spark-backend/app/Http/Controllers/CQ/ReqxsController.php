<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-06
 */
namespace Spark\Http\Controllers\CQ;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\CQ\Reqx;
use Spark\Models\CQ\Boxcar;

class ReqxsController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param String $boxcarId
     * @return Response
     */
    public function index(Request $request, $boxcarId = null) {

        // If this is called as a child resource of a boxcar, return only PRs for that boxcar
        if ($boxcarId) {
            $query = Boxcar::findOrFail($boxcarId)->Reqxs();
        } else {
            $query = Reqx::query();
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
            $query = $query->where('id', 'like', $match)
                            ->orWhere('Headline', 'like', $match)
                            ->orWhere('Product_Name', 'like', $match)
                            ->orWhere('Description', 'like', $match);
        }

        $ReqxModel = new Reqx();
        $ReqxModelTableName = $ReqxModel->getTable();

        $query = $query->orderBy($ReqxModelTableName.'.id', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $result = $query->paginate($perPage);
        } else {
            $result = $query->get();
        }

        return $result;
    }

    /**
     * Display the specified resource.
     *
     * @param String $id
     * @param String $boxcarId
     * @return JSON for the ImplRequest, or a ModelNotFoundException
     */
    public function show($id, $boxcarId = null) {
        return Reqx::findOrFail($id);
    }
}
