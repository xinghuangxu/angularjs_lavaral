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
use Spark\Models\CQ\Boxcar;
use Spark\Models\CQ\DevRequest;

class DevRequestsController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param String $boxcarId
     * @return Response
     */
    public function index(Request $request, $boxcarId = null) {

        // If this is called as a child resource of a boxcar, return only DevRequests for that boxcar
        if ($boxcarId) {
            $query = Boxcar::findOrFail($boxcarId)->DevRequests();
        } else {
            $query = DevRequest::query();
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

        $devRequestModel = new DevRequest();
        $devRequestModelTableName = $devRequestModel->getTable();

        $query = $query->orderBy($devRequestModelTableName.'.id', 'ASC')->select($getFilter);

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
     * @param String $id1
     * @param String $id2
     * @return JSON for the DevRequest, or a ModelNotFoundException
     */
    public function show($id1, $id2 = null) {

        if(strlen($id2) > 0){
            $id = $id2;
            $boxcarId = $id1;
        }else{
            $id = $id1;
            $boxcarId = "";
        }

        return DevRequest::findOrFail($id);
    }
}
