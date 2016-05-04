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
use Illuminate\Validation\Validator;
use Spark\Models\Planner\TestPlan;
use Spark\Models\Planner\TestPlanStack;
use Spark\Utils\utilFunctions;
use \Auth;
use \Exception;

class TmpTestPlanController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    public function ListTopServices(request $request) {
        if(env('APP_ENV') == "hq")
        {
            if ($request->input('arrange_by') == 1){
                $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.top.list.json");
            }
            else{
                $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.top.list2.json");
            }
            return response($data)->header('Content-Type', 'application/json');
        }
    }

    public function ListTestPlanCategories() {
        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.categories.json");
            return response($data)->header('Content-Type', 'application/json');
        }
    }

    public function ListTestCases() {
        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.testcases.categories.json");
            return response($data)->header('Content-Type', 'application/json');
        }
    }
    
    public function ListArrangeBy(){
        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.arrange.by.json");
            return response($data)->header('Content-Type', 'application/json');
        }
    }

    /**
     * *
     * Provide a list of testplans which match the supplied criteria.
     *
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/tmp.testplan.testcases.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $release = $request->input('release');
        $stack = $request->input('stack');
        $substack = $request->input('substack');

        if ($release) {
            $query = TestPlan::where('release_id', 'like', $release);
            if (isset($stack) && empty($stack)) {
                $query = $query->whereNull('testplan_stack_id')->whereNull('testplan_substack_id');
            } else {
                if (preg_match("/^LSIP2/", $stack))
                    $query = $query->where('testplan_boxcar_id', '=', $stack);
                else
                    $query = $query->where('testplan_stack_id', '=', $stack);

                if (isset($substack) && empty($substack)) {
                    $query = $query->whereNull('testplan_substack_id');
                } else {
                    $query = $query->where('testplan_substack_id', '=', $substack);
                }
            }

            $result = $query->with([
                            'release',
                            'stack',
                            'substack',
                            'boxcar'
            ])->get();

            // Plan/stack/substack doesn't exist, so create it
            if (count($result) < 1) {
                // Check User Permissions by Roles
                // User not authorized to do this action
                if ($this->roleCheck() == false) {
                    $responseArr = utilFunctions::createResponse("unauthorized");
                    $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

                    // Exit early so nothing else happens
                    return response($responseArrJson, $responseArr ["code"]);
                }
                $currentUser = Auth::user()->username;
                $plan = new TestPlan();
                $plan->created_by = $plan->updated_by = $currentUser;
                $plan->release_id = $release;

                if(isset($stack) && preg_match("/^LSIP2/", $stack)) {
                    $plan->testplan_boxcar_id = $stack;
                    $plan->testplan_stack_id = TestPlanStack::where('name', 'like', 'Boxcar')->get(['id'])[0]['id'];
                } else if (!empty($stack)) {
                    $plan->testplan_stack_id = $stack;
                }

                if(!empty($substack)) {
                    $plan->testplan_substack_id = $substack;
                }

                $plan->save();

                $result = [$plan->with(['release', 'stack', 'substack', 'boxcar'])->findOrFail($plan->id)];

            }
        } else {
            $result = TestPlan::all();
        }

        return $result;
    }

    /**
     *
     * @param unknown $request
     */
    public function store(Request $request) {
        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);
        }
        $currentUser = Auth::user()->username;

        $plan = new TestPlan();
        $plan->fill($request->all());
        $plan->created_by = $plan->updated_by = $currentUser;
        if (preg_match("/^LSIP2/", $plan->testplan_boxcar_id) && !isset($plan->testplan_stack_id)) {
            $plan->testplan_stack_id = TestPlanStack::where('name', 'like', 'Boxcar')->get(['id'])[0]['id'];
        }

        try {
            if ($plan->save()) {
                $result = $plan->with('release', 'stack', 'substack', 'boxcar')->findOrFail($plan->id);
                return $result;
            }
        } catch ( Exception $e ) {

            $errorCode = $e->getCode();

            $errorMessage = "";
            switch ($errorCode) {
                case 23000 :
                    $errorMessage = "This Test Plan already exists";
                    break;
            }

            return response($errorMessage, 409);
        }
    }

    /**
     *
     * @param unknown $id
     * @param Request $request
     * @return void|unknown
     */
    public function update($id, Request $request) {

        // Check User Permissions by Roles
        // User not authorized to do this action
        if ($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr ["code"]);
        }
        $currentUser = Auth::user()->username;

        $plan = TestPlan::findOrFail($id);
        $plan->fill($request->except('release_id', 'testplan_stack_id', 'testplan_substack_id'));
        $plan->updated_by = $currentUser;

        if ($plan->saveWithHistory()) {
            $result = $plan->with('release', 'stack', 'substack', 'boxcar')->findOrFail($plan->id);
            return $result;
        }
    }
}
