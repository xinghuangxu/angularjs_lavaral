<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-12
 */
namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spark\Utils\utilFunctions;
use Carbon\Carbon;
use \Auth;
use \Session;
use Spark\Models\TestStrategy;
use Spark\Models\ScopeStrategyMapping;
use DB;
use Illuminate\Support\Collection;

class TestStrategysController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    protected static $rolesAllowed = array("TATT", "QA_Rev", "QA_Eng", "RQA_Eng", "RQA_Eng");
    /**
     * Provide a list of TestStrategies
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        if(env('APP_ENV') == "hq")
        {
            if ($request->input('type') == 'c'){
                $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.strategies2.json");
            }else{
                $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.strategies.json");
            }

            return response($data)->header('Content-Type', 'application/json');
        }

        // Return subset of fields or all details
        $fieldsParam = $request->input('fields');
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

        // Type parameter
        $typeParam = $request->input('type');
        $typeParamData = array();
        if (strlen($typeParam) > 0) {
            $typeParamData = explode(',', $typeParam);
        }

        // Qual Area Tags parameter
        $tagsQualAreaParam = $request->input('tagsqualarea');
        $tagsQualAreaParamData = array();
        if (strlen($tagsQualAreaParam) > 0) {
            $tagsQualAreaParamData = explode(',', $tagsQualAreaParam);
        }

        // Impact Area Tags parameter
        $tagsImpactAreaParam = $request->input('tagsimpactarea');
        $tagsImpactAreaParamData = array();
        if (strlen($tagsImpactAreaParam) > 0) {
            $tagsImpactAreaParamData = explode(',', $tagsImpactAreaParam);
        }

        // Test Approaches Tags parameter
        $tagsApproachParam = $request->input('tagsapproach');
        $tagsApproachParamData = array();
        if (strlen($tagsApproachParam) > 0) {
            $tagsApproachParamData = explode(',', $tagsApproachParam);
        }

        // Details - Display relationships if this parameter is passed
        $detailsParam = $request->input('details');
        if ($detailsParam == "true") {

            $query = TestStrategy::with(
                'tagsQualArea',
                'tagsImpactArea',
                'tagsTestApproach'
            )->with(TestStrategy::strategyRequirements())
            ->with(TestStrategy::suggestedTestCases());

        }else{
            $query = TestStrategy::with('tagsQualArea', 'tagsImpactArea', 'tagsTestApproach');
        }

        // TopicID parameter
        $topicIdParam = $request->input('topicid');
        if (strlen($topicIdParam) > 0) {
            $query = $query->where('TopicID', '=', $topicIdParam);
        }

        // Type parameter
        if (strlen($typeParam) > 0) {
            for($k = 0; $k < count($typeParamData); $k ++) {
                $query = $query->orWhere('Type', '=', $typeParamData[$k]);
            }
        }

        // Qual Area Tags
        if (strlen($tagsQualAreaParam) > 0) {
            $query = $this->searchTagsQualArea($query, $tagsQualAreaParamData);
        }

        // Impact Area Tags
        if (strlen($tagsImpactAreaParam) > 0) {
            $query = $this->searchTagsImpactArea($query, $tagsImpactAreaParamData);
        }

        // Test Approaches Tags
        if (strlen($tagsApproachParam) > 0) {
            $query = $this->searchTagsApproach($query, $tagsApproachParamData);
        }

        // Search parameter
        $searchParam = $request->input('search'); // Search
        if (strlen($searchParam) > 0) {
            $match = "%$searchParam%";
            $query = $query->where('TopicID', 'like', $match)->orWhere('StrategyHeadline', 'like', $match)->orWhere('TestStrategy', 'like', $match);

            // Qual Area Tags
            $query = $this->searchTagsQualArea($query, $tagsQualAreaParamData);

            // Impact Area Tags
            $query = $this->searchTagsImpactArea($query, $tagsImpactAreaParamData);

            // Test Approaches Tags
            $query = $this->searchTagsApproach($query, $tagsApproachParamData);

        }

        $query = $query->orderBy('StrategyID', 'ASC')->select($getFilter);

        if ($perPage != "all") {
            $result = $query->paginate($perPage);
        } else {
            $result = $query->get();
        }

        //Post processing for getting StrategyRequirements data
        if ($detailsParam == "true") {
            foreach($result as $testStrategy)
            {
                //Collect the strategy requirements - Pass by reference
                $this->populateStrategyRequirements($testStrategy);
                $this->populateSuggestedTestCases($testStrategy);
            }
        }

        return $result;
    }

    /**
     * Search Qualification Areas relationship
     *
     * @param $query (Laravel Query Object)
     * @param $tagsQualAreaParamData Array
     * @return $query (Laravel Query Object)
     */
    public function searchTagsQualArea($query, $tagsQualAreaParamData)
    {
        $query = $query->whereHas('tagsQualArea', function($q) use ($tagsQualAreaParamData)
            {
                $q = $q->where(function ($q) use ($tagsQualAreaParamData)
                {
                    for($k = 0; $k < count($tagsQualAreaParamData); $k ++) {
                        if($k == 0){
                            $q = $q->where('CategoryName', 'like', '%'.$tagsQualAreaParamData[$k].'%');
                        }else{
                            $q = $q->orWhere('CategoryName', 'like', '%'.$tagsQualAreaParamData[$k].'%');
                        }
                    }
                });
            });

        return $query;
    }

    /**
     * Search Impact Areas relationship
     *
     * @param $query (Laravel Query Object)
     * @param $tagsImpactAreaParamData Array
     * @return $query (Laravel Query Object)
     */
    public function searchTagsImpactArea($query, $tagsImpactAreaParamData)
    {
        $query = $query->whereHas('tagsImpactArea', function($q) use ($tagsImpactAreaParamData)
        {
            $q = $q->where(function ($q) use ($tagsImpactAreaParamData)
            {
                for($k = 0; $k < count($tagsImpactAreaParamData); $k ++) {
                    if($k == 0){
                        $q = $q->where('CategoryName', 'like', '%'.$tagsImpactAreaParamData[$k].'%');
                    }else{
                        $q = $q->orWhere('CategoryName', 'like', '%'.$tagsImpactAreaParamData[$k].'%');
                    }
                }
             });
        });

        return $query;
    }

    /**
     * Search Test Approaches relationship
     *
     * @param $query (Laravel Query Object)
     * @param $tagsApproachParamData Array
     * @return $query (Laravel Query Object)
     */
    public function searchTagsApproach($query, $tagsApproachParamData)
    {
        $query = $query->whereHas('tagsTestApproach', function($q) use ($tagsApproachParamData)
        {
            $q = $q->where(function ($q) use ($tagsApproachParamData)
            {
                for($k = 0; $k < count($tagsApproachParamData); $k ++) {
                    if($k == 0){
                        $q = $q->where('CategoryName', 'like', '%'.$tagsApproachParamData[$k].'%');
                    }else{
                            $q = $q->orWhere('CategoryName', 'like', '%'.$tagsApproachParamData[$k].'%');
                    }
                }
             });
        });

        return $query;
    }

    /**
     *
     * @param unknown $id
     * @return Ambigous <\Illuminate\Database\Eloquent\Model, \Illuminate\Database\Eloquent\Collection>
     */
    public function show($id) {

        if(env('APP_ENV') == "hq")
        {
            $data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/json/get-rest.strategies_details.json");
            return response($data)->header('Content-Type', 'application/json');
        }

        $testStrategy = TestStrategy::with('tagsQualArea', 'tagsImpactArea', 'tagsTestApproach')
                            ->with(TestStrategy::strategyRequirements())
                            ->with(TestStrategy::suggestedTestCases())
                            ->findOrFail($id);

        //Collect the strategy requirements - Pass by reference
        $this->populateStrategyRequirements($testStrategy);
        $this->populateSuggestedTestCases($testStrategy);
        $testStrategy->associations =
            ScopeStrategyMapping::with('prscope')
                                ->where('RequirementType', '=', 'PR')
                                ->where('StrategyID', '=', $testStrategy->StrategyID)
                                ->orderBy('ScopeStrategyMappingID', 'ASC')
                                ->select('StrategyID', 'ScopeStrategyMappingID', 'RequirementID')
                                ->get();

        return $testStrategy;
    }

    /**
     * Populate Strategy Requirements
     *
     * @param $testStrategy (Laravel Query Result Object) - Pass by reference
     */
    public function populateStrategyRequirements($testStrategy)
    {
        $testStrategy->strategyRequirements = new Collection();
        foreach(TestStrategy::strategyRequirements() as $reqType) {
            $testStrategy->strategyRequirements = $testStrategy->strategyRequirements->put($reqType, $testStrategy->$reqType);
            unset($testStrategy->$reqType);
        }
    }

    /**
     * Populate Suggestd Test Cases
     *
     * @param $testStrategy (Laravel Query Result Object) - Pass by reference
     */
    public function populateSuggestedTestCases($testStrategy) {
        //Collect the test cases
        $testStrategy->suggestedTestCases = new Collection();
        foreach(TestStrategy::suggestedTestCases() as $testType) {
            $testStrategy->suggestedTestCases = $testStrategy->suggestedTestCases->put($testType, $testStrategy->$testType);
            unset($testStrategy->$testType);
        }
    }

    /**
     *
     * @param Request $request
     * @throws Exception
     * @return boolean|\Spark\Models\TestStrategy
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

        $testStrategy = new TestStrategy();

        // Default values
        $testStrategy->Owner = $testStrategy->CreatedBy = $testStrategy->ModifiedBy = $currentUser;
        $testStrategy->CreatedDate = $testStrategy->ModifiedDate = $currentDate;
        $testStrategy->TopicID = $testStrategy->VariationOf = $testStrategy->generateTopicID();
        $testStrategy->VariationPoint = "Original";
        $testStrategy->TopicRev = 0;
        $testStrategy->State = 'Assigned';
        $testStrategy->IsActive = 1;
        $testStrategy->Type = 'G';
        $testStrategy->TopicRevComments = 'New Test Strategy created.';

        // TODO Evaluate the Variation and Revision workflow.
        // Allow override of default values to accomodate Variation/Revision
        $testStrategy->fill($request->except('TopicID', 'Tags', 'StrategyID'));
        try {
            DB::transaction(function() use ($request, $testStrategy){
                $testStrategy->save();
                $this->updateTags($request, $testStrategy);
                $this->updateRequirements($request, $testStrategy);
                $this->updateSuggestedTestCases($request, $testStrategy);
            });
        }
        catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }

        $testStrategy = $this->show($testStrategy->StrategyID);
        return $testStrategy;
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

        $testStrategy = TestStrategy::with('tagsQualArea', 'tagsImpactArea', 'tagsTestApproach')
                                    ->with(TestStrategy::strategyRequirements())
                                    ->findOrFail($id);

        if ($testStrategy->ModifiedDate !== $request->input('ModifiedDate')) {
            $errorMessage = "There is a conflicting version of this Strategy in the database.  Please update the latest record.";
            return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 409); //409 = mismatch
        }

        $testStrategy->fill($request->except('TopicID', 'CreatedBy', 'CreatedDate', 'VariationOf', 'VariationPoint', 'Tags', 'StrategyID'));
        $testStrategy->ModifiedBy = $currentUser;
        $testStrategy->ModifiedDate = $currentDate;

        try {
            DB::transaction(function() use ($request, $testStrategy){
                $testStrategy->saveWithHistory();
                $this->updateTags($request, $testStrategy);
                $this->updateRequirements($request, $testStrategy);
                $this->updateSuggestedTestCases($request, $testStrategy);
            });
        }
        catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }

        $testStrategy = $this->show($id);
        return $testStrategy;
    }

    /**
     * Update the "Tags" for a test strategy; qual area, impact areas, and test approach
     * @param Request $request the http request; used to retrieve
     * @param TestStrategy $testStrategy the test strategy for which to update the tags
     */
    public function updateTags(Request $request, $testStrategy) {

        $currentTags = [];
        $piece = $request->input('tags_qual_area');
        $currentTags[] = $piece[0]['CategoryID'];
        $piece = $request->input('tags_test_approach');
        $currentTags[] = $piece[0]['CategoryID'];
        $tags = $request->input('tags_impact_area');
        foreach ($tags as $tag) {
            $currentTags[] = $tag['CategoryID'];
        }
        $testStrategy->tags()->sync($currentTags);
    }


    /**
     *
     * @param Request $request the http request
     * @param TestStrategy $testStrategy
     */
    public function updateRequirements(Request $request, $testStrategy) {
        $strategyRequirements = $request->input('strategyRequirements');
        if(empty($strategyRequirements)) return;
        foreach($strategyRequirements as $reqType => $reqArray) {
            $currentReqs = [];
            foreach($reqArray as $req) {
                switch($reqType) {
                    case 'adhocs':
                        \Spark\Models\Adhoc::findOrFail($req['ScopeID']);
                        $currentReqs[] = $req['ScopeID'];
                        break;
                    case 'archdocs':
                        \Spark\Models\Archdoc::findOrFail($req['ID']);
                        $currentReqs[] = $req['ID'];
                        break;
                    default:
                        //TODO $reqType::findOrFail($req['id']);
                        $currentReqs[] = $req['id'];
                }
            }
            if (count($currentReqs) > 0) {
                $testStrategy->$reqType()->sync($currentReqs);
            } else {
                //Hack: remove all associations
                $testStrategy->$reqType()->sync([0]);
                $testStrategy->$reqType()->detach([0]);
            }
        }
    }

    /**
     *
     * @param Request $request the http request
     * @param TestStrategy $testStrategy
     */
    public function updateSuggestedTestCases(Request $request, $testStrategy) {
        $suggestedTestCases = $request->input('suggestedTestCases');
        if(empty($suggestedTestCases)) return;
        foreach($suggestedTestCases as $almType => $testArray) {
            $current = [];
            foreach($testArray as $test) {
                $current[] = $test['TS_TEST_ID'];
            }
            if (count($current) > 0) {
                $testStrategy->$almType()->sync($current);
            } else {
                //Hack: remove all associations
                print($almType()->first()['TS_TEST_ID']);
                exit();
                //$testStrategy->$almType()->sync([0]);
                //$testStrategy->$almType()->detach([0]);
            }
        }
    }

    /**
     * Create a new revision of the given strategy
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function revision(Request $request, $strategyId) {
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

        $testStrategy = TestStrategy::with('tagsQualArea', 'tagsImpactArea', 'tagsTestApproach')
                            ->with(TestStrategy::strategyRequirements())
                            ->with(TestStrategy::suggestedTestCases())
                            ->findOrFail($strategyId);

        try {

             // TestStrategy should be Active
            if($testStrategy["IsActive"] == "1")
            {
                /*
                //Not implemented entirely hence commented for now

                //Create new TestStrategy
                $newTestStrategy = new TestStrategy();

                $newTestStrategy->Owner = $newTestStrategy->CreatedBy = $newTestStrategy->ModifiedBy = $currentUser;
                $newTestStrategy->CreatedDate = $newTestStrategy->ModifiedDate = $currentDate;
                $newTestStrategy->TopicID = $newTestStrategy->VariationOf = $newTestStrategy->generateTopicID();
                $newTestStrategy->VariationPoint = "Original";
                $newTestStrategy->TopicRev = $testStrategy["TopicRev"] + 1;
                $newTestStrategy->State = 'Assigned';
                $newTestStrategy->IsActive = 1;
                $newTestStrategy->Type = 'G';
                $newTestStrategy->TopicRevComments = 'New Test Strategy created.';
                $newTestStrategy->StrategyHeadline = $testStrategy["StrategyHeadline"];
                $newTestStrategy->TestStrategy = $testStrategy["TestStrategy"];
                $newTestStrategy->save();

                //Mark old one as Obsolete
                $testStrategy->IsActive = '0';
                $testStrategy->ModifiedBy = $currentUser;
                $testStrategy->ModifiedDate = $currentDate;
                $testStrategy->saveWithHistory();

                $newTestStrategy = $this->show($newTestStrategy->StrategyID);
                return $newTestStrategy;
                */
            }else{
                $errorMessage = "The TestStrategy is Not Active";
                return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 400); //400 = Bad Request
            }

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }

/**
     * Create a new variation of the given strategy
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function variation(Request $request, $strategyId) {
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

        $testStrategy = TestStrategy::with('tagsQualArea', 'tagsImpactArea', 'tagsTestApproach')
                            ->with(TestStrategy::strategyRequirements())
                            ->with(TestStrategy::suggestedTestCases())
                            ->findOrFail($strategyId);

        try {

             // TestStrategy should be Active
            if($testStrategy["IsActive"] == "1")
            {
                /*
                //Not implemented entirely hence commented for now

                //Create new TestStrategy
                $newTestStrategy = new TestStrategy();

                $newTestStrategy->Owner = $newTestStrategy->CreatedBy = $newTestStrategy->ModifiedBy = $currentUser;
                $newTestStrategy->CreatedDate = $newTestStrategy->ModifiedDate = $currentDate;
                $newTestStrategy->TopicID = $newTestStrategy->VariationOf = $newTestStrategy->generateTopicID();
                $newTestStrategy->VariationPoint = "Original";
                $newTestStrategy->TopicRev = $testStrategy["TopicRev"] + 1;
                $newTestStrategy->State = 'Assigned';
                $newTestStrategy->IsActive = 1;
                $newTestStrategy->Type = 'G';
                $newTestStrategy->TopicRevComments = 'New Test Strategy created.';
                $newTestStrategy->StrategyHeadline = $testStrategy["StrategyHeadline"];
                $newTestStrategy->TestStrategy = $testStrategy["TestStrategy"];
                $newTestStrategy->save();

                //Mark old one as Obsolete
                $testStrategy->IsActive = '0';
                $testStrategy->ModifiedBy = $currentUser;
                $testStrategy->ModifiedDate = $currentDate;
                $testStrategy->saveWithHistory();

                $newTestStrategy = $this->show($newTestStrategy->StrategyID);
                return $newTestStrategy;
                 */
            }else{
                $errorMessage = "The TestStrategy is Not Active";
                return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 400); //400 = Bad Request
            }

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }

    /**
     * Approve the given strategy
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function approve(Request $request, $strategyId) {
        //Check User Permissions by Roles

        //Only 'TATT' role allowed to do this operation
        $rolesAllowed = array("TATT");

        //User not authorized to do this action
        if($this->roleCheck($rolesAllowed) == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        $testStrategy = TestStrategy::findOrFail($strategyId);

        try {

             // TestStrategy should be Active
            if($testStrategy["IsActive"] == "1")
            {
                $testStrategy->State = 'Approved';
                $testStrategy->ModifiedBy = $currentUser;
                $testStrategy->ModifiedDate = $currentDate;
                $testStrategy->saveWithHistory();

                $testStrategy = $this->show($testStrategy->StrategyID);
                return $testStrategy;
            }else{
                $errorMessage = "The TestStrategy is Not Active";
                return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 400); //400 = Bad Request
            }

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }

    /**
     * Promote the given strategy to core
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function promote(Request $request, $strategyId) {
        //Check User Permissions by Roles

        //Only 'TATT' role allowed to do this operation
        $rolesAllowed = array("TATT");

        //User not authorized to do this action
        if($this->roleCheck($rolesAllowed) == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        $testStrategy = TestStrategy::findOrFail($strategyId);

        try {

             // TestStrategy has to be of Type G AND should be Active AND should be in Approved State
            if( ($testStrategy["Type"] == "G") && ($testStrategy["IsActive"] == "1") && ($testStrategy["State"] == "Approved") )
            {
                $testStrategy->Type = 'C';
                $testStrategy->ModifiedBy = $currentUser;
                $testStrategy->ModifiedDate = $currentDate;
                $testStrategy->saveWithHistory();

                $testStrategy = $this->show($testStrategy->StrategyID);
                return $testStrategy;
            }else{
                $errorMessage = "The TestStrategy is either Not in Approved State or Not Active or is not Type G";
                return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 400); //400 = Bad Request
            }

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }

    /**
     * Demote the given strategy from core
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function demote(Request $request, $strategyId) {

        //Check User Permissions by Roles

        //Only 'TATT' role allowed to do this operation
        $rolesAllowed = array("TATT");

        //User not authorized to do this action
        if($this->roleCheck($rolesAllowed) == false) {
            $responseArr = utilFunctions::createResponse("unauthorized");
            $responseArrJson = json_encode($responseArr, JSON_PRETTY_PRINT);

            // Exit early so nothing else happens
            return response($responseArrJson, $responseArr["code"]);
        }
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        $testStrategy = TestStrategy::findOrFail($strategyId);

        try {

            // TestStrategy has to be of Type C
            if($testStrategy["Type"] == "C")
            {
                $testStrategy->Type = 'G';
                $testStrategy->ModifiedBy = $currentUser;
                $testStrategy->ModifiedDate = $currentDate;
                $testStrategy->saveWithHistory();

                $testStrategy = $this->show($testStrategy->StrategyID);
                return $testStrategy;
            }else{
                $errorMessage = "The TestStrategy is not Type C";
                return response()->json(array('error' => $errorMessage, 'testStrategy' => $testStrategy), 400); //400 = Bad Request
            }

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }

    /**
     * Mark the given strategy as obsolete
     *
     * @param Request $request
     * @param int $strategyId Strategy ID
     */
    public function obsolete(Request $request, $strategyId) {

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

        $testStrategy = TestStrategy::findOrFail($strategyId);

        try {

            $testStrategy->IsActive = '0';
            $testStrategy->ModifiedBy = $currentUser;
            $testStrategy->ModifiedDate = $currentDate;
            $testStrategy->saveWithHistory();

            $testStrategy = $this->show($testStrategy->StrategyID);
            return $testStrategy;

        }catch (Exception $e) {
            $errorMessage = "Error saving Test Strategy: " . $e->getMessage();
            return response($errorMessage, 400);
        }
    }
}
