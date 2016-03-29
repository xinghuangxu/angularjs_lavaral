<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;

class PRScope extends Model {
    public $timestamps = false;
    protected $table = 'PRScopes';
    public $primaryKey = 'ScopePRID';


    public function scopestrategymapping()
    {
        return $this->hasMany('Spark\Models\ScopeStrategyMapping', 'RequirementID', 'ScopePRID');
    }

    public function cq_pr()
    {
        return $this->hasOne('Spark\Models\CQ\PR', 'id', 'PRID')->select(['id','Headline']);
    }

    /*
    public function scopestrategymapping()
    {
        return $this->belongsTo('Spark\Models\ScopeStrategyMapping','ScopePRID','RequirementID');
    }
    */

    /*
    public function scopestrategymappings()
    {
        return $this->hasMany('Spark\Models\ScopeStrategyMapping','ScopePRID','RequirementID');
    }
    */

}