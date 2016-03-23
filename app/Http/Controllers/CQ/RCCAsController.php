<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-05
 */
namespace Spark\Http\Controllers\CQ;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\CQ\RCCA;

class RCCAsController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request) {

        // Id parameter
        $idParam = $request->input('id');

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

        $query = RCCA::query();

        if (strlen($searchParam) > 0) { // Search parameter
            $match = "%$searchParam%";
            $query = $query->where('id', 'like', $match)
                            ->orWhere('Headline', 'like', $match)
                            ->orWhere('Product_Name', 'like', $match)
                            ->orWhere('Description', 'like', $match);
        }

        if (strlen($idParam) > 0) { // Search parameter
            $query = $query->where('id', '=', $idParam);
        }

        $query = $query->orderBy('dbid', 'ASC')->select($getFilter);

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
     * @return JSON for the ImplRequest, or a ModelNotFoundException
     */
    public function show($id) {
        return RCCA::findOrFail($id);
    }
}
