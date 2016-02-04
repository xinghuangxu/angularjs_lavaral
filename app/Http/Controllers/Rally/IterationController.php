<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\Rally;

use Spark\Http\Controllers\Controller;
use Spark\Http\Requests;
use Illuminate\Http\Request;
use Spark\Models\Rally\Models\Iteration;

class IterationController extends Controller {

    /**
     *
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     * Returns list of Iteration for a particular project
     *
     * @param string $id
     *   The ProjectName in Rally
     * @return [array] that contains list of all Iterations 
     */
    public function index($id) {
        $IterationList = Iteration::ListIterations($id);
        return $this->_ToJson($IterationList);
    }

    /**
     * Returns the data along with the status code( -1,1)
     * if status code is 1 that means there is a set of a results included 
     * if status code is -1 that means either there is no results or 
     * there is an error from Rally server 
     * @param array $Result
     *   The Result contains data
     * @return [array] that contains data along with the status code( -1,0,1) 
     */
    private function _ToJson($Result, $Message = '') {
        if (isset($Message) && $Message != "") {
            return \Response::json(array (
                            'data' => array (),
                            'Error_message' => $Message,
                            'Status_code' => - 1,
                            "Count" => 0
            ));
        } elseif (isset($Result) && is_array($Result)) {
            return \Response::json(array (
                            'data' => $Result,
                            'Status_code' => 1,
                            "Count" => count($Result)
            ));
        } else {
            return \Response::json(array (
                            'data' => "No results",
                            'Status_code' => - 1,
                            "Count" => 0
            ));
        }
    }
}
