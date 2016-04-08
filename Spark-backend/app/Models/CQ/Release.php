<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-16
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class Release extends CQ {
    public $timestamps = false;
    protected $table = 'View_LSIP2_Release';
    public $primaryKey = 'Name';

    protected $appends = array('obj_type');

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }

    public function getObjTypeAttribute()
    {
        return "release";
    }

}
