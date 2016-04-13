<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\ALM;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\ALM\TestCase;
use InvalidArgumentException;

class TestCasesController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Display all test cases for the requested ALM database
     *
     * @param String $almDatabase
     * @return TestCase
     * @throws \Spark\ALM\InvalidAlmDatabaseException
     */
    public function index(Request $request, $almDatabase) {
        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or all details
        $getFilter = "*";
        if (strlen($fieldsParam) > 0) {
            $getFilter = explode(',', $fieldsParam);
        }

        // Results per page parameter
        $perPageParam = $request->input('perpage');
        $perPage = "50";
        if (strlen($perPageParam) > 0) {
            $perPage = $perPageParam;
        }

        // Search parameter
        $searchParam = $request->input('search');
        $searchParam = "%" . $searchParam . "%";

        if ($searchParam) {
            return TestCase::from($almDatabase)->where('TS_TEST_ID', 'like', $searchParam)->orWhere('TS_NAME', 'like', $searchParam)->orWhere('TS_STATUS', 'like', $searchParam)->orWhere('TS_USER_02', 'like', $searchParam)-> // EstimatedDuration
orWhere('TS_CREATION_DATE', 'like', $searchParam)->orWhere('TS_TYPE', 'like', $searchParam)->orWhere('TS_USER_21', 'like', $searchParam)-> // AutomationStatus
orWhere('TS_USER_09', 'like', $searchParam)-> // TestCaseType
select($getFilter)->paginate($perPage);
        }

        return TestCase::from($almDatabase)->select($getFilter)->paginate($perPage);
    }

    /**
     * Display the specified test case
     *
     * @param String $almDatabase
     * @param String $testId
     * @return TestCase
     * @throws ModelNotFoundException
     * @throws \Spark\ALM\InvalidAlmDatabaseException
     */
    public function show($almDatabase, $testId) {
        return TestCase::from($almDatabase)->findOrFail($testId);
    }
}

