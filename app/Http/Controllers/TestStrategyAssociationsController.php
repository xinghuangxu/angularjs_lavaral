<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-13
 */
namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Utils\utilFunctions;
use Carbon\Carbon;
use \Auth;
use \Session;
use Spark\Models\ScopeStrategyMapping;
use DB;
use Illuminate\Support\Collection;

class TestStrategyAssociationsController extends Controller {
    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");

    /**
     * Provide a list of Strategy Associations
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request, $strategyId) {

        // results per page parameter
        $perPageParam = $request->input('perpage');
        $perPage = "50";
        if (strlen($perPageParam) > 0) {
            $perPage = $perPageParam;
        }

        $query = ScopeStrategyMapping::with('prscope')->where('RequirementType', '=', 'PR')->where('StrategyID', '=', $strategyId);

        $query = $query->orderBy('ScopeStrategyMappingID', 'ASC')->select('StrategyID', 'ScopeStrategyMappingID', 'RequirementID');

        if ($perPage != "all") {
            $result = $query->paginate($perPage);
        } else {
            $result = $query->get();
        }

        return $result;
    }

}
