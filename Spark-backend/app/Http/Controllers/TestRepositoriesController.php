<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-04-11
 */

namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Spark\Models\ALM\Database;
use Illuminate\Http\Request;

class TestRepositoriesController extends Controller {

    /**
     * Pull ALM database definitons from Config facade and return them as arrays with
     * elements "name" and "description"
     */
    public function index(Request $request) {

        //Get all ALM databases from .env file
        $almDatabasesArr = Database::getAllDatabases();


        $commonAttribsArr = array(
            'icon' => 'glyphicon glyphicon-folder-open',
            'obj_type' => 'testrepository'
        );

        $testReposArr = array();

        $testReposArr[] = array_merge(array(
                                    'id' => '1',
                                    'title' => 'RunCheck',
                                    'dbname' => 'runcheck'
                                ), $commonAttribsArr);

        for($k = 0; $k < count($almDatabasesArr); $k++)
        {
            $cnt = $k + 2;

            $testReposArr[] = array_merge(array(
                                    'id' => "$cnt",
                                    'title' => 'ALM - '.str_replace("_", " ", $almDatabasesArr[$k]['description']),
                                    'dbname' => $almDatabasesArr[$k]['name']
                                ), $commonAttribsArr);

        }

        return response()->json($testReposArr);
    }


}