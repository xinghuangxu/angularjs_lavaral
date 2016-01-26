<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2015 NetApp, Inc.
 */

namespace Spark\Models;

use Spark\Models\Model;

class Archdoc extends Model {
    public $timestamps = false;
    protected $table = 'Req_ArchDocs_Dev';
    public $primaryKey = 'ID';
    //Maneesh has created a view, so this may be useful for some reporting need.
    //protected $table = 'VIEW_Laravel_ArchDocs';
    
    public function testStrategies() {
        return $this->morphToMany('Spark\Models\TestStrategy', 'strategizable');
    }
}
