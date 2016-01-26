<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;
use Spark\Models\Planner\TestPlan;

class ScopeStrategyMapping extends Model {
    public $timestamps = false;
    protected $table = 'ScopeStrategyMapping';
    public $primaryKey = 'ScopeStrategyMappingID';

    public function testplan() {
        return $this->belongsToMany('Spark\Models\Planner\TestPlan','testplan_x_ScopeStrategyMappings','ScopeStrategyMappingID','testplan_id')
            ->withTimestamps();
    }

    public function prscope()
    {
        return $this->belongsTo('Spark\Models\PRScope', 'RequirementID', 'ScopePRID')->select(['ScopePRID','PRID'])->with('cq_pr');
    }

    public function enhreqscope()
    {
        return $this->belongsTo('Spark\Models\PRScope', 'RequirementID', 'ScopeID');
    }

    public function defectscope()
    {
        return $this->belongsTo('Spark\Models\DefectScope', 'RequirementID', 'ScopeDefectID');
    }

    public function implrequestscope()
    {
        return $this->belongsTo('Spark\Models\ImplRequestScope', 'RequirementID', 'ScopeID');
    }
}
