<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-20
 */

namespace Spark\Models\CQ;

use Spark\Models\CQ\CQ;

class Task extends CQ {
    protected $table = 'AccessView_LSIP2_Task';
    public $primaryKey = 'id'; // Though [dbid] is the actual primary key, we will use [id] as the primary key

    protected $appends = array('icon', 'obj_type');

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }

    public function getIconAttribute()
    {
        return "glyphicon glyphicon-cog";
    }

    public function getObjTypeAttribute()
    {
        return "task";
    }

}
