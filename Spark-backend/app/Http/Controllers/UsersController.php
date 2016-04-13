<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Models\User;

class UsersController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Provide a list of Users
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or all details
        $getFilter = "*";
        if (strlen($fieldsParam) > 0) {
            $getFilter = explode(',', $fieldsParam);
        }

        // Search parameter
        $searchParam = $request->input('search');

        $query = User::with('roles');

        if (strlen($searchParam) > 0) {
            $match = "%$searchParam%";
            $query = $query->where('Username', 'like', $match)->orWhere('Fullname', 'like', $match);
        }

        $query = $query->orderBy('Username', 'ASC')->select($getFilter);

        $query = $query->get();

        return $query;
    }

    /**
     *
     * @param unknown $id
     * @return Ambigous <\Illuminate\Database\Eloquent\Model, \Illuminate\Database\Eloquent\Collection>
     */
    public function show($id) {
        return User::query()->findOrFail($id);
    }
}
