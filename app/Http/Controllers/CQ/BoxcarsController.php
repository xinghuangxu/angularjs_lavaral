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
use Spark\Models\CQ\Boxcar;

class BoxcarsController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request) {
        $search = $request->input('search');

        if ($search) {
            $match = "%$search%";

            return Boxcar::where('id', 'like', $match)->orWhere('Name', 'like', $match)->orWhere('State', 'like', $match)->orWhere('Forecasted_Release', 'like', $match)->get();
        }

        return Boxcar::all();
    }

    /**
     * Display the specified resource.
     *
     * @param String $cqid
     * @return JSON for the boxcar, or a ModelNotFoundException
     */
    public function show($cqid) {
        return Boxcar::findOrFail($cqid);
    }
}
