<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;

class TestPlanTestStrategy extends Model {
    public $timestamps = true;
    protected $fillable = [
        'updaed_by',
        'priority',
        'scope',
        'risk',
        'leverage'
    ];

    public function testplan() {
        return $this->hasOne('Spark\Models\Planner\TestPlan', 'id', 'testplan_id');
    }

    public function teststrategy() {
        return $this->hasOne('Spark\Models\TestStrategy', 'StrategyID', 'StrategyID');
    }

}
