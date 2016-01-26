<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;

class RallyTestplanScopeStrategyMapping extends Model {
    public $timestamps = false;
    protected $table = 'rally_x_testplan_ScopeStrategyMappings';

    protected $fillable = [
        'created_by',
        'updated_by'
    ];

}
