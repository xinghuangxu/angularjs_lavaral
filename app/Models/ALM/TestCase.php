<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2015 NetApp, Inc.
 */

namespace Spark\Models\ALM;
use Spark\Models\Model;

class TestCase extends AlmModel {
    public $timestamps = false;
    protected $table = 'td.TEST';
    public $primaryKey = 'TS_TEST_ID';

    public function testStrategies() {
        return $this->morphToMany('Spark\Models\TestStrategy', 'strategizable');
    }
}
