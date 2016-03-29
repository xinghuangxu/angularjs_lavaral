<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

namespace Spark\Models;

use Spark\Models\Model;

class Adhoc extends Model {
    public $timestamps = false;
    protected $table = 'AdHocRequirements';
    public $primaryKey = 'ScopeID';

    protected $fillable = [
        'Type',
        'ID',
        'Title',
        'IDLink',
        'DocNumber',
        'DocTitle',
        'DocRevision',
        'DocLink',
    ];

    public function testStrategies() {
        return $this->morphToMany('Spark\Models\TestStrategy', 'strategizable');
    }
}
