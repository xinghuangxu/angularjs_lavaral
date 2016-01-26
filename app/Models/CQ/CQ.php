<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class CQ extends Model {
    public $timestamps = false;
    protected $connection = 'cq_mirror';
    protected $table = 'View_LSIP2';

    public function testStrategies() {
        return $this->morphToMany('Spark\Models\TestStrategy', 'strategizable', 'strategizables');
    }
}
