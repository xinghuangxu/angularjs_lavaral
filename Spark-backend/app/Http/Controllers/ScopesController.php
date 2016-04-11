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
use Spark\Models\Scope;

class ScopesController extends Controller {

    /**
     * Provide a list
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') != "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.scopes.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        // Fields parameter
        $fieldsParam = $request->input('fields');

        // Return subset of fields or all details
        $getFilter = "*";
        if (strlen($fieldsParam) > 0) {
            $getFilter = explode(',', $fieldsParam);
        }

        // results per page parameter
        $perPageParam = $request->input('perpage');
        $perPage = "50";
        if (strlen($perPageParam) > 0) {
            $perPage = $perPageParam;
        }

        // Search parameter
        $searchParam = $request->input('search');

        // Boxcar parameter
        $boxcarIdParam = $request->input('boxcar');
        $boxcarIdParamMatch = "%" . $boxcarIdParam . "%";

        // ReqxID parameter
        $reqxIdParam = $request->input('reqxid');
        $reqxIdParamMatch = "%" . $reqxIdParam . "%";

        $query = Scope::query();

        if (strlen($boxcarIdParam) > 0) {
            $query = $query->where('ScopePhase', '=', 'HighLevel')->where('Boxcar', 'like', $boxcarIdParamMatch);
        } elseif (strlen($reqxIdParamMatch) > 0) {
            $query = $query->where('ScopePhase', '=', 'HighLevel')->where('ReqxID', 'like', $reqxIdParamMatch);
        } elseif (strlen($searchParam) > 0) { // Search parameter
            $match = "%$searchParam%";
            $query = $query->where('ReqxTitle', 'like', $match)->orWhere('RequirementID', 'like', $match)->orWhere('TopicID', 'like', $match)->orWhere('TopicName', 'like', $match);
        }

        $query = $query->orderBy('StrategyID', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $query = $query->paginate($perPage);
        } else {
            $query = $query->get();
        }

        return $query;
    }

    /**
     *
     * @param unknown $id
     * @return {\Illuminate\Database\Eloquent\Model}
     */
    public function show($id) {
        return Scope::query()->findOrFail($id);
    }
}
