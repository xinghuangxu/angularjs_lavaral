<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;

class TestStrategyReq extends Model {
    public $timestamps = false;
    protected $table = 'VIEW_Laravel_TestStrategyReqs';
    public $primaryKey = 'StrategyID';
}
