<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\CQ;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\CQ\PR;
use Spark\Models\CQ\Boxcar;

class PRsController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request, $boxcarId) {
        // If this is called as a child resource of a boxcar, return only PRs for that boxcar
        if ($boxcarId) {
            $query = Boxcar::findOrFail($boxcarId)->PRs();
        } else {
            $query = PR::query();
        }

        // Only get EnhReqs with POR_Approved if the query param is provided
        $porApproved = $request->input('POR_Approved');
        if ($porApproved) {
            $query = $query->where('POR_Approved', '=', $porApproved);
        }

        // Only get specified fields if the "fields" query param is provided
        $fields = $request->input('fields');

        if ($fields) {
            $fields = explode(',', $fields);
            return $query->get($fields);
        } else {
            return $query->get();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param String $id
     * @return JSON for the PR, or a ModelNotFoundException
     */
    public function show($boxcarId, $id) {
        return PR::findOrFail($id);
    }
}
