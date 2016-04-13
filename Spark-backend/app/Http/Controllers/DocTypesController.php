<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-04-11
 */

namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocTypesController extends Controller {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Provide a list of ArchDocs Topics
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        $commonAttribsArr = array(
            'icon' => 'glyphicon glyphicon-align-left',
            'obj_type' => 'doctype'
        );

        $docTypesArr = array();

        $docTypesArr[] = array_merge(array(
                                    'id' => '1',
                                    'text' => 'Architecture Requirement',
                                    'abbrev' => 'AR'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '2',
                                    'text' => 'Concept Architectural Specification',
                                    'abbrev' => 'CAS'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '3',
                                    'text' => 'Detailed Architecture',
                                    'abbrev' => 'DA'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '4',
                                    'text' => 'External Requirements',
                                    'abbrev' => 'ER'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '5',
                                    'text' => 'Product Architectural Specification',
                                    'abbrev' => 'PAS'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '6',
                                    'text' => 'Regression Strategies',
                                    'abbrev' => 'RS'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '7',
                                    'text' => 'Software Interface Specification',
                                    'abbrev' => 'SIS'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '8',
                                    'text' => 'Statement of Work',
                                    'abbrev' => 'SOW'
                                ), $commonAttribsArr);

        $docTypesArr[] = array_merge(array(
                                    'id' => '9',
                                    'text' => 'User Experience',
                                    'abbrev' => 'UX'
                                ), $commonAttribsArr);

        return response()->json($docTypesArr);

    }

}
