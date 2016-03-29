<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-10
 */

namespace Spark\Models\CQ;

use Spark\Models\CQ\CQ;

class DevRequest extends CQ {
    protected $table = 'View_LSIP2_DevelopmentRequest';
    public $primaryKey = 'id'; // Though [dbid] is the actual primary key, we will use [id] as the primary key

    protected $appends = array('icon');

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }

    public function getIconAttribute()
    {
        return "glyphicon glyphicon-briefcase";
    }

    public function ImplRequests() {
        return $this->belongsToMany('Spark\Models\CQ\ImplRequest', 'View_LSIP2_DevRequest_AssocImplRequest', 'DevRequest_ID', 'ImplRequest_ID');
    }
}
