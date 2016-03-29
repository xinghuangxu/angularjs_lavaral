<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;
use Spark\Models\CQ\Boxcar;


class BoxcarScope extends Model {
    public $timestamps = false;
    public $primaryKey = 'ScopeID';
	protected $table = 'BoxcarScopes';
    protected $guarded = ['ScopeID'];

	public function boxcar() {
        return $this->belongsTo('Spark\Models\Boxcar', 'BoxcarID');
    }
}
