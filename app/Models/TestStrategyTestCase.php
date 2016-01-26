<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

namespace Spark\Models;

use Spark\Models\Model;

class TestStrategyTestCase extends Model {
    public $timestamps = false;
    protected $table = 'StrategyTestCases';
    public $primaryKey = 'MappingID';
    protected $fillable = ['StrategyID', 'Domain', 'TS_TEST_ID'];


    public function teststrategies() {
        $this->belongsTo('Spark\Models\TestStrategy', 'StrategyID', 'StrategyID');
    }

}
