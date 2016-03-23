<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-15
 */

namespace Spark\Models\v2;

use Spark\Models\Model;

class ArchDocTopic extends Model {
    public $timestamps = false;
    protected $table = 'archdocs_topics';
    public $primaryKey = 'id';

    protected $appends = array('icon', 'type');

    public function getIconAttribute()
    {
        return "glyphicon glyphicon-list-alt";
    }

    public function getTypeAttribute()
    {
        return "archdoc_topic";
    }

}
