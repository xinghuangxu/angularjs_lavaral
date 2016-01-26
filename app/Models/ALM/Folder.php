<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\ALM;

class Folder extends AlmModel {
    protected $table = 'td.CYCL_FOLD';
    public $primaryKey = 'CF_ITEM_ID';
}