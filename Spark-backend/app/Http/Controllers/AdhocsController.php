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
use Spark\Models\Adhoc;
use \Auth;
use Carbon\Carbon;

class AdhocsController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");

    /**
     * Provide a list of Adhoc requirements
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

        // results per page parameter
        $perPageParam = $request->input('perpage');
        $perPage = "50";
        if (strlen($perPageParam) > 0) {
            $perPage = $perPageParam;
        }

        // Search parameter
        $searchParam = $request->input('search');

        $query = Adhoc::query();

        if (strlen($searchParam) > 0) { // Search parameter
            $match = "%$searchParam%";
            $query = $query->where('Title', 'like', $match)
                            ->orWhere('ID', 'like', $match)
                            ->orWhere('IDLink', 'like', $match)
                            ->orWhere('DocTitle', 'like', $match)
                            ->orWhere('DocLink', 'like', $match);
        }

        $query = $query->select($getFilter);

        if ($perPage != "all") {
            $query = $query->paginate($perPage);
        } else {
            $query = $query->get();
        }

        return $query;
    }

    public function show($id) {
        return Adhoc::query()->findOrFail($id);
    }

    /**
     *
     * @param Request $request
     * @throws Exception
     * @return boolean|\Spark\Models\Adhoc
     */
    public function store(Request $request) {
        // TODO validation
        //Check User Permissions by Roles
        //User not authorized to do this action
        if($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        $adhoc = new Adhoc();

        // Default values
        $adhoc->CreatedBy = $currentUser;
        $adhoc->CreatedDate = $currentDate;

        $adhoc->fill($request->all());

        try {
            $adhoc->save();
        }
        catch (Exception $e) {
            $errorMessage = "Error saving manual requirement: " . $e->getMessage();
            return response($errorMessage, 400);
        }

        $adhoc = $this->show($adhoc->ScopeID);
        return $adhoc;
    }

    /**
     *
     * @param Request $request
     * @param unknown $id
     * @throws Exception
     * @return boolean|unknown
     */
    public function update(Request $request, $id) {

        // TODO validation
        //Check User Permissions by Roles
        //User not authorized to do this action
        if($this->roleCheck() == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        $adhoc = Adhoc::findOrFail($id);

        $adhoc->fill($request->all());

        try {
            $adhoc->save();
        }
        catch (Exception $e) {
            $errorMessage = "Error saving manual requirement: " . $e->getMessage();
            return response($errorMessage, 400);
        }

        $adhoc = $this->show($id);
        return $adhoc;
    }

}
