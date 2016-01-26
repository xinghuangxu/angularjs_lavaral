<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;
use Spark\Models\Planner\TestPlanStack;

class TestPlanSubStack extends Model {
    protected $table = 'testplan_substacks';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'stack_id',
        'created_by',
        'poc',
        'description',
        'display_order'
    ];
}
