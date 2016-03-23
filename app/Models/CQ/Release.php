<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-05
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class Release extends CQ {
    public $timestamps = false;
    protected $table = 'View_LSIP2_Release';
    public $primaryKey = 'Name';

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }
}
