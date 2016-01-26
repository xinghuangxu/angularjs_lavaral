<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\ALM;

class TestCycle extends AlmModel {
    protected $table = 'td.TESTCYCL';
    public $primaryKey = 'TC_TESTCYCL_ID';

    public function cycle(){
        return $this->belongsTo('Spark\Models\ALM\Cycle','CY_CYCLE_ID','TC_CYCLE_ID');
    }

    public function testCase() {
        return $this->hasOne('Spark\Models\ALM\TestCase','TS_TEST_ID','TC_TEST_ID');
    }

    //Laravel method of defining relationships seems to use the Class not an instance of the Model.
    //  The way that we model ALM is to define which database once it is instantiated.
    //  The result is the underlying SQL query doesn't know that you are intending to execute on a new database.
    //
    // public function testplanScopeStrategyMappings() {
    //     return $this->belongsToMany('Spark\Models\Planner\TestplanScopeStrategyMappings',
    //         'testcase_x_testplan_ScopeStrategyMappings',
    //         'tc_testcycle_id', 'tpssm_id')
    //         ->withTimestamps();
    // }
}
