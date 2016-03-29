<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-02-26
 */

namespace Spark\Models\ALM;

class TestSet extends AlmModel {
    protected $table = 'td.CYCLE';
    public $primaryKey = 'CY_CYCLE_ID';
}