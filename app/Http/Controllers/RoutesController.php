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
use Route;

class RoutesController extends Controller {
    public function index() {
        $routeCollection = Route::getRoutes();

        $str = "<table style='width:100%'>
                <tr>
                <td width='10%'><h4>HTTP Method</h4></td>
                <td width='40%'><h4>Route</h4></td>
                <td width='50%'><h4>Corresponding Action</h4></td>
                </tr>";

        foreach ( $routeCollection as $value ) {

            $str .= "<tr>
                <td>" . $value->getMethods() [0] . "</td>
                <td>/" . $value->getPath() . "</td>
                <td>" . $value->getActionName() . "</td>
                </tr>";
        }
        $str .= "</table>";

        echo $str;
    }
}
