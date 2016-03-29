<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

namespace Spark\Models;

use Spark\Models\Model;

class Comment extends Model {
    public $timestamps = false;
    public $primaryKey = "CommentID";
    protected $table = 'CommentsTracking';

    public function testStrategy() {
        return $this->belongsTo('Spark\Models\TestStrategy','TopicID','PrimaryKeyValue');
    }
}
