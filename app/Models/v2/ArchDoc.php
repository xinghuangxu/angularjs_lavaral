<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-15
 */

namespace Spark\Models\v2;

use Spark\Models\Model;

class ArchDoc extends Model {
    public $timestamps = false;
    protected $table = 'archdocs';
    public $primaryKey = 'id';

    protected $appends = array('icon', 'type');

    public function getIconAttribute()
    {
        return "glyphicon glyphicon-book";
    }

    public function getTypeAttribute()
    {
        return "archdoc";
    }

    public function Topics() {
        return $this->hasMany('Spark\Models\v2\ArchDocTopic', 'doc_db_id');
    }

    public function Reqxs() {

        //return $this->belongsToMany('Spark\Models\CQ\Reqx', 'tattdb_maneesha2.dbo.View_archdocs_reqx_mapping', 'doc_db_id', 'reqx_id')->select(array('id', 'Headline')); // experimental

        //return $this->belongsToMany('Spark\Models\CQ\ReqxCache', 'View_archdocs_reqx_mapping', 'doc_db_id', 'reqx_db_id')->select(array('reqx_id', 'reqx_title')); // experimental

        //return $this->belongsToMany('Spark\Models\CQ\Reqx', 'Spark\Models\ArchDocReqxMapping', 'doc_db_id', 'reqx_id')->select(array('id', 'Headline')); // experimental

        return $this->belongsToMany('Spark\Models\CQ\Reqx', env('TATTDB_DATABASE').'.dbo.View_archdocs_reqx_mapping', 'doc_db_id', 'reqx_id')->select(array('id AS reqx_id', 'Headline AS reqx_title', 'ReqxType AS reqx_type'));

    }

    public function Boxcars() {

        return $this->belongsToMany('Spark\Models\CQ\Boxcar', env('TATTDB_DATABASE').'.dbo.View_archdocs_boxcars_mapping', 'doc_db_id', 'boxcar_id')->select(array('id AS boxcar_id', 'Name AS boxcar_name'));

    }

}
