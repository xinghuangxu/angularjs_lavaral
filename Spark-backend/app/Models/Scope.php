<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-14
 */

namespace Spark\Models;

use Spark\Models\Model;

class Scope extends Model {
    public $timestamps = false;
    protected $table = 'VIEW_Laravel_ScopingDetails_All';

    protected $appends = array('icon');

    public function getIconAttribute()
    {
        return '/images/icon_law.png';
    }

}
