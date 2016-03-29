<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2015 NetApp, Inc.
 */

namespace Spark\Models;

use Spark\Models\Model;
use Spark\Models\ALM\TestCase;
use Spark\Models\Comment;
use Carbon\Carbon;

class TestStrategy extends Model {
    public $timestamps = false;
    protected $table = 'TestStrategies';
    public $primaryKey = 'StrategyID';
    //TODO remove manually populated suggested test cases
    //protected $appends = ['suggestedTestCases'];

    protected $fillable = [
        'Owner',
        'VariationOf',
        'VariationPoint',
        'RevisionOf',
        'TopicRev',
        'State',
        'TopicRevComments',
        'StrategyHeadline',
        'TestStrategy',
        'Approach',
        'Goal'
    ];
    protected $excludeHistoryArray = [
        'ModifiedBy',
        'ModifiedDate',
        'suggestedTestCases',
        'tags'
    ];
    protected $defaultALMColumns = [
        'TS_TEST_ID',
        'TS_NAME',
        'TS_PATH',
        'TS_CREATION_DATE',
        'TS_RESPONSIBLE',
        'TS_STEPS',
        'TS_USER_02',
        'TS_STATUS',
        'TS_TYPE',
    ];

    function __construct() {
        $this->TopicID = $this->generateTopicID();
        parent::__construct();
    }

    public function tagsQualArea() {
        return $this->belongsToMany('Spark\Models\Tag', 'TestStrategyCategories', 'StrategyID', 'CategoryID')
                    ->where('CategoryPath', 'like', 'Root\Default\Qualification Areas%');
    }

    public function tagsImpactArea() {
        return $this->belongsToMany('Spark\Models\Tag', 'TestStrategyCategories', 'StrategyID', 'CategoryID')
                    ->where('CategoryPath', 'like', 'Root\Feature%');
    }

    public function tagsTestApproach() {
        return $this->belongsToMany('Spark\Models\Tag', 'TestStrategyCategories', 'StrategyID', 'CategoryID')
                    ->where('CategoryPath', 'like', 'Root\Default\Test Strategy Approach%');
    }

    public function tags() {
        return $this->belongsToMany('Spark\Models\Tag', 'TestStrategyCategories', 'StrategyID', 'CategoryID');
    }

    public function adhocs() {
        return $this->morphedByMany('Spark\Models\Adhoc', 'strategizable', 'strategizables', 'StrategyID')
                    ->withTimestamps();
    }

    public function archdocs() {
        return $this->morphedByMany('Spark\Models\Archdoc', 'strategizable', 'strategizables', 'StrategyID')
                    ->withTimestamps();
    }

    public function defects() {
        return $this->morphedByMany('Spark\Models\CQ\Defect', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select(['VIEW_LSIP2_Defect.id', 'Headline', 'State'])
                    ->withTimestamps();
    }

    public function enhreqs() {
        return $this->morphedByMany('Spark\Models\CQ\EnhReq', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select(['VIEW_LSIP2_EnhancementRequest.id', 'Headline', 'State'])
                    ->withTimestamps();
    }

    public function implrequests() {
        return $this->morphedByMany('Spark\Models\CQ\ImplRequest', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select(['VIEW_LSIP2_ImplRequest.id', 'Headline', 'State'])
                    ->withTimestamps();
    }

    public function prs() {
        return $this->morphedByMany('Spark\Models\CQ\PR', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select(['VIEW_LSIP2_ProdRequirement.id', 'Headline', 'State'])
                    ->withTimestamps();
    }

    public function rccas() {
        return $this->morphedByMany('Spark\Models\CQ\RCCA', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select(['VIEW_LSIP2_RCCA.id', 'Headline', 'State'])
                    ->withTimestamps();
    }

    public static function strategyRequirements() {
        return [
            'adhocs',
            'archdocs',
            'defects',
            'enhreqs',
            'implrequests',
            'prs',
            'rccas'
        ];
    }

//TODO remove old requirements and references
    // public function requirements()
    // {
    //     return $this->hasMany('Spark\Models\TestStrategyReq','StrategyID','StrategyID');
    // }
    //
    // public function references()
    // {
    //     return $this->hasMany('Spark\Models\TestStrategyReference','StrategyID','StrategyID');
    // }

    public function comments() {
        return $this->hasMany('Spark\Models\Comment', 'PrimaryKeyValue', 'TopicID');
    }

    /**
     * Provide a list of "association" methods for Test Cases.
     */
    public static function suggestedTestCases() {
        $live = [
            'testCasesBench',
            'testCasesBST',
            'testCasesDCT',
            'testCasesHL',
            'testCasesIBP',
            'testCasesIOP',
            'testCasesPT',
            'testCasesTools'
        ];
        $dev = [
            'testCasesMarkTest'
        ];
        return (env('APP_ENV') == 'local') ? $dev : $live;
    }

    public function testCasesBench() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseBench', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesBST() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseBST', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesDCT() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseDCT', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesHL() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseHL', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesIBP() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseIBP', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesIOP() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseIOP', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesPT() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCasePT', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesTools() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseTools', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

    public function testCasesMarkTest() {
        return $this->morphedByMany('Spark\Models\ALM\TestCase\TestCaseMarkTest', 'strategizable', env('TATTDB_DATABASE').'.dbo.strategizables', 'StrategyID')
                    //->select(['TS_TEST_ID', 'TS_NAME', 'TS_TYPE'])
                    ->select($this->defaultALMColumns)
                    ->withTimestamps();
    }

//TODO remove old suggestedTests
    // public function suggestedTests() {
    //     return $this->hasMany('Spark\Models\TestStrategyTestCase', 'StrategyID', 'StrategyID');
    // }

    public function testplans() {
        return $this->belongsToMany('Spark\Models\Planner\TestPlan', 'test_plan_test_strategies', 'StrategyID', 'testplan_id')
                    ->withTimestamps();
    }

//TODO remove manually collected suggested Test Cases
    // public function getSuggestedTestCasesAttribute()
    // {
    //     $testCaseMappings = $this->suggestedTests()->get();
    //     $testCases = [];
    //
    //     forEach ($testCaseMappings as $testCaseMapping)
    //     {
    //         $testID = $testCaseMapping->TS_TEST_ID;
    //         $database = $testCaseMapping->Domain . '_db';
    //         $testCases[] = TestCase::from($database)->find($testID);
    //     }
    //
    //     return $testCases;
    // }

    static public function generateTopicID() {
        static $characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        static $characterSetetLength = 35;  //zero relative count
        $topicID = "T-" . substr(Carbon::now()->toIso8601String(), 0, -5) . "-";  //DateTime without timezone offset

        for ($i=0; $i<10; $i++){
            $topicID .= $characterSet[rand(0, $characterSetetLength)];
        }
        return $topicID;
    }
}
