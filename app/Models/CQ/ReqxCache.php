<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-03-05
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class ReqxCache extends Model {
    protected $table = 'cq_reqxs';
    public $primaryKey = 'id';
}
