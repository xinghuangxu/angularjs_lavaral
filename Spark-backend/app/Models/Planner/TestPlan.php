<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2015 NetApp, Inc.
 */

namespace Spark\Models\Planner;

use Spark\Models\Model;
use Spark\Models\ALM\Database;
use Spark\Models\ALM\Folder;

class TestPlan extends Model {
    protected $table = 'testplans';
    public $timestamps = true;
    protected $fillable = [
            'release_id',
            'testplan_stack_id',
            'testplan_boxcar_id',
            'testplan_substack_id',
            'alm_db_name',
            'alm_folder_node_id',
            'alm_testset_prefix',
            'project_start_date',
            'project_completion_date',
            'rally_project_id',
            'rally_release_id',
            'wiki_url'
    ];
    protected $excludeHistoryArray = [
        'project_start_date',
        'project_completion_date'
    ];

    protected $appends = [
            'alm_db_description',
            'alm_folder_name'
    ];

    public function release() {
        return $this->hasOne ('\Spark\Models\CQ\Release', 'Name', 'release_id')->select(['Name']);
    }

    public function stack() {
        return $this->hasOne('\Spark\Models\Planner\TestPlanStack', 'id', 'testplan_stack_id')->select(['id', 'name']);
    }

    public function substack() {
        return $this->hasOne('\Spark\Models\Planner\TestPlanSubStack', 'id', 'testplan_substack_id')->select(['id', 'name']);
    }

    public function boxcar() {
        return $this->hasOne('\Spark\Models\CQ\Boxcar', 'id', 'testplan_boxcar_id')->select(['id', 'Name']);
    }

    public function teststrategies() {
        return $this->belongsToMany('Spark\Models\TestStrategy', 'test_plan_test_strategies', 'testplan_id', 'StrategyID')
                    ->withTimestamps();
    }

    public function getAlmDbDescriptionAttribute() {
        if (env('APP_ENV') == 'local') return "Not available on DEV.";
        return Database::getDetails($this->attributes['alm_db_name'], true)['description'];
    }

    public function getAlmFolderNameAttribute() {
        if (env('APP_ENV') == 'local') return "Not available on DEV.";
        if (is_null($this->alm_folder_node_id)) {
            return ('Select an ALM folder for this Test Plan');
        } else {
            return Folder::from($this->attributes['alm_db_name'])->find($this->alm_folder_node_id)->attributes['CF_ITEM_NAME'];
        }
    }

    public function scopeStrategyMappings() {
        return $this->belongsToMany('Spark\Models\ScopeStrategyMapping', 'testplan_x_ScopeStrategyMappings', 'testplan_id', 'ScopeStrategyMappingID')
            ->withTimestamps();
    }
}
