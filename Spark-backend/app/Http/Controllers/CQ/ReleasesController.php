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
use Spark\Models\CQ\Release;

class ReleasesController extends Controller {

    /**
     * Provide a list of active CQ releases
     *
     * @param
     *            list (optional) list == true then results will only contain id and Name fields for use as a selection.
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.cq.releases.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        if ($request->input('optionsList'))
            return Release::lists('name', 'name');

        $fields = $request->input('fields');

        $query = Release::where('State', 'like', 'Active')->orderBy('name');

        // Return subset of fields or all details?
        if ($fields) {
            $getFilter = explode(',', $fields);
            return $query->get($getFilter);
        } else {
            return $query->get();
        }
    }

    /**
     * Return JSON for a particular release
     *
     * @param
     *            $releaseId
     * @return Response
     */
    public function show($releaseName) {
        return Release::findOrFail($releaseName);
    }
}
