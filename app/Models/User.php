<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Model;
use Ccovey\LdapAuth\LdapUser;

class User extends LdapUser {
    public $timestamps = false;
    protected $table = 'Users';
    public $primaryKey = 'Username';

    // The following are fields provided by the AD.  More can be added by modifying the "fields" key in config/auth.php.
    //  Note: The default used by the AD library is 'username' (lowercase) and the tattdb uses 'Username' (uppercase) as its primary key.
    //  I have added the 'ssoName' which, for content, is a duplicate of the AD 'username', but allows for a less confusing reference.
    protected $fillable = ['username', 'ssoName', 'displayName', 'cn', 'employeeType', 'longEmail', 'email'];

    public function __construct($attributes = []) {
        parent::__construct($attributes);
    }

    //TODO: Needs correct Swagger annotation
    // Username = string, primary key, "SSO username"
    // Fullname = string, "First space Last names"
    // IsActive = bit
    // CreatedBy = string, "sso of the admin who created this user"
    // CreatedDate = datetime, "when this user was created"

    public function roles() {
        return $this->belongsToMany('Spark\Models\UserRole', 'UserRoleMapping', 'Username', 'RoleID');
    }

    /***
     * Shortcut method to see if a user has a Spark role by that role's name.
     *
     * @param string $roleName
     * @return boolean
     */
    public function hasRole($roleName){
        return ($this->roles()->where('Role','=',$roleName)->first()!==null);
    }
}
