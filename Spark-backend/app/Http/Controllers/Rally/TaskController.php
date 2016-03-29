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
use Symfony\Component\HttpFoundation\Response;
use Spark\Models\Rally\Models\Task;

class TaskController extends Controller {

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
     * Returns list of task names and their states for a particular user story
     *
     * @return [array] that contains list of task names and their states 
     */
    public function index() {
        $Result = Task::ListTasks(\Request::input('userstory'));
        return $this->_ToJson($Result);
    }

    /**
     * This function validates the parameters passed to Creates the task 
     *
     * @return [array] that contains data of newly created task
     */
    public function create() {
        $validation = \Validator::make(\Request::all(), [
                        'title' => 'required|max:256',
                        'Desc' => 'max:32,768',
                        'StoryID' => 'required',
                        'estimate' => 'max:128',
                        'owner' => 'max:256',
                        'project' => 'required'
        ]);
        if ($validation->passes()) {
            $Result = Task::CreateTask(\Request::all());
            return $this->_ToJson($Result);
        } else {
            return $this->_ToJson("", $validation->messages());
        }
    }

    /**
     * Returns Object details of a task
     *
     * @param [string] $id
     *   The $TaskID is unique objectID of a task
     * @return [array] that contains object details of a task
     */
    public function show($id) {
        $Result = Task::TaskDetails($id);
        return $this->_ToJson($Result);
    }

    /**
     * This function validates the parameters passed to edit the task 
     * @param [string] $id
     *   The $TaskID is unique objectID of a task that has to be edited
     * @return [array] that contains data of edited task
     */
    public function edit($id) {
        $validation = \Validator::make(\Request::all(), [
                        'title' => 'max:256',
                        'Desc' => 'max:32,768',
                        'TaskID' => 'required',
                        'estimate' => 'max:128',
                        'owner' => 'max:256',
                        'project' => 'required'
        ]);
        if ($validation->passes()) {
            $Result = Task::UpdateTask(\Request::all());
            return $this->_ToJson($Result);
        } else {
            return $this->_ToJson("", $validation->messages());
        }
    }

    /**
     * This function Delete the task 
     *
     * @param [string] $id
     *   The $id is unique objectID of a task that has to be deleted
     * @return void
     */
    public function destroy($id) {
        $Result = Task::DeleteTask($id);
        return $Result;
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
