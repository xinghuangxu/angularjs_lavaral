<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2017 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers\ALM;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Spark\Models\ALM\Database;
use Illuminate\Http\Request;

class DatabasesController extends Controller {

    /**
     * Pull ALM database definitons from Config facade and return them as arrays with
     * elements "name" and "description"
     */
    public function index(Request $request) {
        $db = $request->input('database');
        if ($db) {
            return Database::getDetails($db);
        } else {
            return Database::getAllDatabases();
        }
    }
}
