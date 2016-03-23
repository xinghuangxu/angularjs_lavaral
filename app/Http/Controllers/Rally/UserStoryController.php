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
     * This function gives all the children of an userstory if has children parameter passed
     * This function gives a list of root user stories if requested for all
     * This function gives details about a speciic user story if queried for it (mainly used for EQI Service)
     *
     * @return [array] which has all the children of an user story
     */
    public function index() {
        if (\Request::has('children')){
            $Result = UserStory::ListChildrenOfUserStory(\Request::input('children'));
        }
        elseif (\Request::has('query')){
            $Result = UserStory::find(\Request::all());
        }
        elseif(\Request::has('NotPlanned')){
            $Result = UserStory::GetNotPlanned(\Request::input('NotPlanned'));
        }
        elseif(\Request::has('NotEstimated')){
            $Result = UserStory::GetNotEstimated(\Request::input('NotEstimated'));
        }
        else{
            $Result = UserStory::ListAllUserStories(\Request::all());
        }
        return $this->_ToJson($Result);
    }

    /**
     * This function creates a user story, all data will be vaildated
     *
     * @return [array] that contains data of newly created user story
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
     * this function will return the results for EQI service
     * @param unknown $id
     */
    public function show($id) {
        $Result = UserStory::EQIfind($id, \Request::all());
        return $this->_ToJson($Result);
    }

    /**
     * This function validates the parameters passed to edit the user story
     * @param [string] $id
     *   The $id is unique objectID of an user story  that has to be edited
     * @return [array] that contains data of edited task
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
     * This function Delete the user story
     *
     * @param [string] #id
     *   The $id is unique objectID of an user story that has to be deleted
     * @return void
     */
    public function destroy($id) {
        $Result = UserStory::DeleteUserStory($id);
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
