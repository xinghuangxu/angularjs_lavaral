<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesCommands;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use \Session;

abstract class Controller extends BaseController {

    use DispatchesCommands, ValidatesRequests;

    /**
     * Authorize a user to do an action
     *
     * @param $allowedRoles {array}
     *            (Optional) List of roles that are allowed to do the action. Defaults to the list defined in the child class
     * @return {boolean} True if the user can perform the action, false otherwise
     */
    public function roleCheck($rolesAllowed = []) {

        // Compare to the list of static roles defined in the class
        // Overrides with the given list if it is longer than 0
        $rolesToCheckAgainst = static::$rolesAllowed;
        if (count($rolesAllowed) > 0) {
            $rolesToCheckAgainst = $rolesAllowed;
        }

        // Roles assigned to the user
        $userRoles = array ();
        if (Session::has('laravelUser')) {
            $userRoles = Session::get('laravelUser')->Roles;
        }

        // Check if any of the user's role is in the Allowed Roles List
        $user_allowed = false;
        for($k = 0; $k < count($userRoles); $k ++) {

            if (in_array($userRoles [$k], $rolesToCheckAgainst) == true) {
                $user_allowed = true;
                break;
            }
        }

        return $user_allowed;
    }
}
