<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\ALM;

class Cycle extends AlmModel {
    protected $table = 'td.CYCLE';
    public $primaryKey = 'CY_CYCLE_ID';

    public function testCycles() {
        return $this->hasMany('Spark\Models\ALM\TestCycle','TC_CYCLE_ID','CY_CYCLE_ID');
    }
}
