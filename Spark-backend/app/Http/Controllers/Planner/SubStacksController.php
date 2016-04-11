<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\Planner;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\Planner\TestPlanStack;
use Spark\Models\Planner\TestPlanSubStack;

class SubStacksController extends Controller {

    /**
     * Provide a list of substack layers based on the provided stack ID
     *
     * @return Response
     */
    public function index(Request $request, $stack) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.planner.stacks2.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $fields = $request->input('fields');
        $getFilter = explode(',', $fields);

        // Check if the stack ID contains LSIP
        if (strpos($stack, 'LSIP') !== false) {
            // assume it is a boxcar ID, get list of boxcar sublayers
            $stack = TestPlanStack::where('name', '=', 'Boxcar')->get(['id'])[0]['id'];
        }

        $substackQuery = TestPlanSubStack::where('stack_id', 'like', $stack)->orderBy('display_order');

        if ($request->input('optionsList')) {
            return $substackQuery->lists('name', 'id');
        }

        // Return only selected fields or all details?
        if ($fields) {
            return $substackQuery->get($getFilter);
        } else {
            return $substackQuery->get();
        }
    }
}
