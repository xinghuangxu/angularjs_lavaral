<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-23
 */

namespace Spark\Models\v2;

use Spark\Models\Model;

class TagGroup extends Model {
    public $timestamps = false;
    protected $table = 'tags_groups';
    public $primaryKey = 'id';

    protected $appends = array('icon', 'obj_type');

    public function getIconAttribute()
    {
        return "glyphicon glyphicon-tags";
    }

    public function getObjTypeAttribute()
    {
        return "tag_group";
    }

}
