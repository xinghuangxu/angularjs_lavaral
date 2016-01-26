<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;

class UserRole extends Model {
    public $timestamps = false;
    public $primaryKey = 'RoleID';
    protected $table = 'Roles';
    protected $guarded = ['RoleID'];

    //TODO: Needs correct Swagger annotation
    // RoleID = integer, primary key, auto increments
    // Role = string "role name"
    // IsActive = bit

    public function users() {
        return $this->belongsToMany('Spark\Models\User','UserRoleMapping', 'RoleID', 'Username');
    }
}