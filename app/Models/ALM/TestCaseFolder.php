<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-03-02
 */

namespace Spark\Models\ALM;

class TestCaseFolder extends AlmModel {
    protected $table = 'td.ALL_LISTS';
    public $primaryKey = 'AL_ITEM_ID';
}