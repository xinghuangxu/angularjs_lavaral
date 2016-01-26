<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use \Session;

class DhtmlxUser {
    public $Username;
    public $Fullname;
    public $IsActive;
    public $CreatedBy;
    public $CreatedDate;
    public $username;
    public $ssoName;
    public $displayName;
    public $cn;
    public $employeeType;
    public $longEmail;
    public $email;

    function __construct() {
        $currentUser = $this->getSessionUser();
        if ($currentUser !== false) {
            $this->populate($currentUser);
        };
    }

    public static function getSessionUser(){
        if (Session::has('laravelUser')) {
            return (Session::get('laravelUser'));
        } else {
            return false;
        }
    }

    private function populate($currentUser) {
        if (!$currentUser->Username) {
            throw new Exception("No user data to populate");
        }
        $this->Username = $currentUser->Username;
        $this->Fullname = $currentUser->Fullname;
        $this->IsActive = $currentUser->IsActive;
        $this->CreatedBy = $currentUser->CreatedBy;
        $this->CreatedDate = $currentUser->CreatedDate;
        $this->username = $currentUser->username;
        $this->ssoName = $currentUser->ssoName;
        $this->displayName = $currentUser->displayName;
        $this->cn = $currentUser->cn;
        $this->employeeType = $currentUser->employeeType;
        $this->longEmail = $currentUser->longEmail;
        $this->email = $currentUser->email;
    }
}
