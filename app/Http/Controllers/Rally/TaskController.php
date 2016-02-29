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
     *
     */
    public function index() {
        $Result = Task::ListTasks(\Request::input('userstory'));
        return $this->_ToJson($Result);
    }

    /**
     *
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
     *
     * @param unknown $id
     */
    public function show($id) {
        $Result = Task::TaskDetails($id);
        return $this->_ToJson($Result);
    }

    /**
     *
     * @param unknown $id
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
     *
     * @param unknown $id
     * @return unknown
     */
    public function destroy($id) {
        $Result = Task::DeleteTask($id);
        return $Result;
    }

    /**
     *
     * @param unknown $Result
     * @param string $Message
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
