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
use Illuminate\Validation\Validator as Validator;
use Spark\Models\Rally\Models\UserStory;

class UserStoryController extends Controller {

    /**
     *
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     *
     */
    public function index() {
        if (\Request::has('children')) {
            $Result = UserStory::ListChildrenOfUserStory(\Request::input('children'));
        } elseif (\Request::has('query')) {
            $Result = UserStory::find(\Request::all());
        } else {
            $Result = UserStory::ListAllUserStories(\Request::all());
        }
        return $this->_ToJson($Result);
    }

    /**
     *
     */
    public function create() {
        $validation = \Validator::make(\Request::all(), [
                        'title' => 'required|max:256',
                        'description' => 'max:32,768',
                        'arch' => 'max:32,768',
                        'state' => 'max:128',
                        'points' => 'max:52',
                        'owner' => 'max:256',
                        'iteration' => 'max:256',
                        'release' => 'max:256',
                        'project' => 'required'
        ]);
        if ($validation->passes()) {
            $Result = UserStory::AddUserStory(\Request::all());
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
        $Result = UserStory::EQIfind($id, \Request::all());
        return $this->_ToJson($Result);
    }

    /**
     *
     * @param unknown $id
     */
    public function edit($id) {
        if (\Request::has('drag')) {
            $Result = \UserStory::DragAndDrop(\Request::all());
            return $this->_ToJson($Result);
        } else {
            $validation = \Validator::make(\Request::all(), [
                            'title' => 'required|max:256',
                            'description' => 'max:32,768',
                            'arch' => 'max:32,768',
                            'state' => 'max:128',
                            'points' => 'max:52',
                            'owner' => 'max:256',
                            'iteration' => 'max:256',
                            'release' => 'max:256',
                            'project' => 'required',
                            'newNodeID' => 'required'
            ]);
            if ($validation->passes()) {
                $Result = UserStory::UpdateUserStory(\Request::all());
                return $this->_ToJson($Result);
            } else {
                return $this->_ToJson("", $validation->messages());
            }
        }
    }

    /**
     *
     * @param unknown $id
     */
    public function destroy($id) {
        $Result = UserStory::DeleteUserStory($id);
        echo "here";
        return $this->_ToJson($Result);
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
