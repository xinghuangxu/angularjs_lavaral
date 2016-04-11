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
use Spark\Models\CQ\Boxcar;

class StacksController extends Controller {

    /**
     * Provide a list of test stack layers based on the provided release information.
     *
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.planner.stacks.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $fields = $request->input('fields');
        $release = $request->input('release');

        $boxcarsQuery = Boxcar::where('State', 'not like', 'Rejected');

        if ($release !== null) {
            $boxcarsQuery = $boxcarsQuery->where('Forecasted_Release', 'like', $release);
        }

        $boxcarsQuery = $boxcarsQuery->orderBy('Name');
        $stackQuery = TestPlanStack::where('name', '!=', 'Boxcar')->orderBy('display_order');

        // Return only selection list or all details?
        if ($fields) {
            $getFilter = explode(',', $fields);
            $sparkStacks = $stackQuery->get($getFilter);
            $cqStacks = $boxcarsQuery->get($getFilter);
        } else {
            if ($request->input('optionsList')) {
                $sparkStacks = $stackQuery->get()->lists('name', 'id');
                $cqStacks = $boxcarsQuery->lists('name', 'id');
            } else {
                $sparkStacks = $stackQuery->get();
                $cqStacks = $boxcarsQuery->get();
            }
        }

        return ($cqStacks->toArray() + $sparkStacks->toArray());
    }

    /**
     * Show a specific stack based on its ID
     *
     * @param
     *            $stackId
     * @return JSON representation of the stack
     */
    public function show($stackId) {
        return TestPlanStack::findOrFail($stackId);
    }
}
