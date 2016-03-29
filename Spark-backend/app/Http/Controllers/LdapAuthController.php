<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-05
 */
namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use \Session;
use \Auth;
use Spark\Models\User;

class LdapAuthController extends Controller {

    /**
     * Check if the user credentials match LDAP and they are active in Spark, store in main Session.
     *
     * @param username String from post data
     * @param password String from post data
     * @return HTMLResponse containing json string and response code 200|401
     */
    function ldapAuth(Request $request) {

        $user = $request->only([
            'username',
            'password'
        ]);

        // Shim to handle capitalization differences
        $user['Username'] = $user['username'];

        if (Auth::attempt($user, true)) {
            // LDAP Object
            $userObj = Auth::user();

            $userArr = explode(",", $userObj->displayName);
            $userLastName = trim($userArr [0]);
            $userFirstName = trim($userArr [1]);

            // Convert LDAP object to Spark\User Object
            if (get_class($userObj) !== 'Spark\User') {
                $tmpUserObj = new User();
                $tmpUserObj->Username = $userObj->username;
                $tmpUserObj->Fullname = $userFirstName . " " . $userLastName;
                $tmpUserObj->IsActive = "1";
                $tmpUserObj->CreatedBy = "system";
                $tmpUserObj->CreatedDate = date("Y-m-d H:i:s");
                $userObj = $tmpUserObj;
            }

            // Get User Roles
            $userRolesObj = $userObj->roles()->get();
            $userRolesArr = array ();
            for($k = 0; $k < count($userRolesObj); $k ++) {
                array_push($userRolesArr, $userRolesObj [$k]->Role);
            }

            // Adding Roles as part of the User Object
            $userObj->Roles = $userRolesArr;

            // Start Laravel Session
            Session::put('laravelUser', $userObj);
            Session::save();

            return response(Auth::user(), 200);
        }

        return response("", 401);
    }

    /**
     * Check if the session has a laravel user set.
     *
     * @return HTMLResponse containing user's SSO Name|false and response code 200|401
     */
    function ldapCheck() {
        $response = null;

        if (Session::has('laravelUser')) {
            $response = Session::get('laravelUser');
        }

        return response($response, 200);
    }

    /**
     * Logout from the Auth facade and delete the laravel user from the main Session.
     *
     * @return HTMLResponse containing json string and response code 200|401
     */
    function ldapLogout() {
        // Laravel Logout
        Auth::logout();

        // Close Laravel Session
        if (Session::has('laravelUser')) {
            Session::forget('laravelUser');
        }

        return response('true', 200);
    }
}
