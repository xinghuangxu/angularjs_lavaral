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
use Spark\Models\Rally\Models\Project;

class ProjectController extends Controller {

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
     *
     * @return [array] that list of projects/lists of iteratons and its details 
     * when project name is passed
     * or 
     * @return [array] that has a list of all projects in specific workspace
     */
    public function index() {
        if (\Request::has('planned')) {
            $Result = Project::GetIterationTable(\Request::input('planned'));
        } else {
            $Result = Project::ListProjects();
        }
        return $this->_ToJson($Result);
    }

    /**
     * Returns the data along with the status code( -1,1)
     * if status code is 1 that means there is a set of a results included 
     * if status code is -1 that means either there is no results or 
     * there is an error 
     * @param array $Result
     *   The Result contains data
     * @param string $Message as the error message 
     * @return [array] that contains data along with the status code( -1,1) 
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
