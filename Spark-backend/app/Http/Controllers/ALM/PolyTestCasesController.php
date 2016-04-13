<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */
namespace Spark\Http\Controllers\ALM;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\ALM\TestCase;
use Spark\Models\TestStrategy;
use Illuminate\Database\Eloquent\Collection;
use InvalidArgumentException;

class PolyTestCasesController extends Controller {

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
    public function index(Request $request) {
        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or default subset details
        $getFilter = [
            'TS_TEST_ID',
            'TS_NAME',
            'TS_PATH',
            'TS_CREATION_DATE',
            'TS_RESPONSIBLE',
            'TS_STEPS',
            'TS_USER_02',
            'TS_STATUS',
            'TS_TYPE',
        ];
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

        $searchTestCases = [];
        $almList = TestStrategy::suggestedTestCases();

        $totalTest = 0;
        foreach($almList as $almModel) {
            $model = 'Spark\Models\ALM\TestCase\\' . preg_replace("/testCases/", "TestCase", $almModel);
            $list = $model::select($getFilter);
            if ($searchParam) {
                $match = "%" . $searchParam . "%";
                $list = $list->where('TS_TEST_ID', 'like', $match)
                            ->orWhere('TS_NAME', 'like', $match)
                            ->orWhere('TS_STATUS', 'like', $match)
                            ->orWhere('TS_USER_02', 'like', $match) // EstimatedDuration
                            ->orWhere('TS_CREATION_DATE', 'like', $match)
                            ->orWhere('TS_TYPE', 'like', $match)
                            ->orWhere('TS_USER_21', 'like', $match) // AutomationStatus
                            ->orWhere('TS_USER_09', 'like', $match);
            }
            $totalTest += $list->count();
        }
        $upperCountLimit = 500;
        if ($totalTest >= $upperCountLimit) {
            $errorMessage = "You are trying to retrieve $totalTest ALM Test records.  ";
            $errorMessage .= "Please use the 'search' parameter to limit the results to something less than $upperCountLimit.";
            return response($errorMessage, 413);
        }

        foreach ($almList as $almModel) {
            $model = 'Spark\Models\ALM\TestCase\\' . preg_replace("/testCases/", "TestCase", $almModel);
            $list = $model::select($getFilter);
            if ($searchParam) {
                $match = "%" . $searchParam . "%";
                $list = $list->where('TS_TEST_ID', 'like', $match)
                            ->orWhere('TS_NAME', 'like', $match)
                            ->orWhere('TS_STATUS', 'like', $match)
                            ->orWhere('TS_USER_02', 'like', $match) // EstimatedDuration
                            ->orWhere('TS_CREATION_DATE', 'like', $match)
                            ->orWhere('TS_TYPE', 'like', $match)
                            ->orWhere('TS_USER_21', 'like', $match) // AutomationStatus
                            ->orWhere('TS_USER_09', 'like', $match);
            }
            $searchTestCases[$almModel] = $list->get();
        }
        return $searchTestCases;
    }

}
