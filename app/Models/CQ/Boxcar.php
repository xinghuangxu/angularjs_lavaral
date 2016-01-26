<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\CQ;

use Spark\Models\Model;

class Boxcar extends Model {
    public $timestamps = false;
    protected $connection = 'cq_mirror';
    protected $table = 'CR_LSIP2_Boxcar';

    public function EnhReqs() {
        return $this->hasMany('Spark\Models\CQ\EnhReq', 'Boxcar');
    }

    public function PRs() {
        return $this->hasMany('Spark\Models\CQ\PR', 'Boxcar');
    }
}
