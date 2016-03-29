<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;
use Spark\Models\Planner\TestPlan;
use Spark\Models\ScopeStrategyMapping;

class TestplanScopeStrategyMapping extends Model {
    public $timestamps = true;
    protected $table = 'testplan_x_ScopeStrategyMappings';

    protected $fillable = [
        'created_by',
        'updated_by'
    ];

    public function testplan() {
        return $this->hasOne('Spark\Models\Planner\TestPlan','id','testplan_id');
    }

    public function scopeStrategyMapping() {
        return $this->hasOne('Spark\Models\ScopeStrategyMapping','ScopeStrategyMappingID','ScopeStrategyMappingID');
    }

    //Laravel method of defining relationships seems to use the Class not an instance of the Model.
    //  The way that we model ALM is to define which database once it is instantiated.
    //  The result is the underlying SQL query doesn't know that you are intending to execute on a new database.
    //
    // public function testCycles() {
    //     return $this->belongsToMany(
    //             'Spark\Models\ALM\TestCycle',
    //             'testcase_x_testplan_ScopeStrategyMappings',
    //             'tpssm_id','tc_testcycle_id');
    // }
}
