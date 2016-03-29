<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;

class TestPlanStack extends Model {
    protected $table = 'testplan_stacks';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'created_by',
        'poc',
        'description',
        'display_order'
    ];
}
