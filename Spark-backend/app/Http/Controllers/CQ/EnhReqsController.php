<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-10
 */
namespace Spark\Http\Controllers\CQ;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\CQ\EnhReq;
use Spark\Models\CQ\Boxcar;

class EnhReqsController extends Controller {

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

        // If this is called as a child resource of a boxcar, return only EnhReqs for that boxcar
        if ($boxcarId) {
            $query = Boxcar::findOrFail($boxcarId)->EnhReqs();
        } else {
            $query = EnhReq::query();
        }

        // Only get EnhReqs with POR_Approved if the query param is provided
        $porApproved = $request->input('por_approved');
        if ($porApproved) {
            $query = $query->where('POR_Approved', '=', $porApproved);
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
                            ->orWhere('Boxcar', 'like', $match)
                            ->orWhere('Requested_Release', 'like', $match)
                            ->orWhere('Forecasted_Release', 'like', $match);
        }

        $enhReqModel = new EnhReq();
        $enhReqModelTableName = $enhReqModel->getTable();

        $query = $query->orderBy($enhReqModelTableName.'.id', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $query = $query->paginate($perPage);
        } else {
            $query = $query->get();
        }

        return $query;


    }

    /**
     * Display the specified resource.
     *
     * @param String $id1
     * @param String $id2
     * @return JSON for the EnhReq, or a ModelNotFoundException
     */
    public function show($id1, $id2 = null) {

        if(strlen($id2) > 0){
            $id = $id2;
            $boxcarId = $id1;
        }else{
            $id = $id1;
            $boxcarId = "";
        }

        return EnhReq::findOrFail($id);
    }
}
