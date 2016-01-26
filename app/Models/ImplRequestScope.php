<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;

class ImplRequestScope extends Model {
    public $timestamps = false;
    protected $table = 'ImplRequestScopes';
    public $primaryKey = 'ScopeID';


    public function scopestrategymapping()
    {
        return $this->hasMany('Spark\Models\ScopeStrategyMapping', 'RequirementID', 'ScopeID');
    }


}