<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class Release extends Model {
    public $timestamps = false;
    protected $connection = 'cq_mirror';
    protected $table = 'View_LSIP2_Release';
    public $primaryKey = 'Name';
}
