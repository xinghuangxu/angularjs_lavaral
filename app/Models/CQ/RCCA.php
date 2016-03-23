<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-05
 */

namespace Spark\Models\CQ;

use Spark\Models\CQ\CQ;

class RCCA extends CQ {
    protected $table = 'View_LSIP2_RCCA';
    public $primaryKey = 'id'; // Though [dbid] is the actual primary key, we will use [id] as the primary key

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }
}
