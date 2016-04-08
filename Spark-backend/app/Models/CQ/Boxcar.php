<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-16
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class Boxcar extends CQ {
    public $timestamps = false;
    protected $table = 'CR_LSIP2_Boxcar';
    public $primaryKey = 'id'; // Though [dbid] is the actual primary key, we will use [id] as the primary key

    protected $appends = array('obj_type');

    public function __construct() {
        $this->table = env('CQ_MIRROR_DATABASE').".dbo.".$this->table;
    }

    public function getObjTypeAttribute()
    {
        return "boxcar";
    }

    public function EnhReqs() {
        return $this->belongsToMany('Spark\Models\CQ\EnhReq', 'View_LSIP2_Requirements_AssocBoxcar', 'Boxcar_ID', 'Req_ID')->where('ReqxType', '=', 'EnhReq');
    }

    public function PRs() {
        return $this->belongsToMany('Spark\Models\CQ\PR', 'View_LSIP2_Requirements_AssocBoxcar', 'Boxcar_ID', 'Req_ID')->where('ReqxType', '=', 'PR');
    }

    public function Reqxs() {
        return $this->belongsToMany('Spark\Models\CQ\Reqx', 'View_LSIP2_Requirements_AssocBoxcar', 'Boxcar_ID', 'Req_ID');
    }

    public function DevRequests() {
        return $this->belongsToMany('Spark\Models\CQ\DevRequest', 'View_LSIP2_Boxcar_AssocDevRequest', 'Boxcar_ID', 'DevRequest_ID');
    }

}
