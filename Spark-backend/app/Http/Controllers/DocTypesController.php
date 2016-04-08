<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-04-06
 */

namespace Spark\Http\Controllers;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocTypesController extends Controller {

    /**
     * Provide a list of ArchDocs Topics
     *
     * @param $request
     * @return Response
     */
    public function index(Request $request) {

        $docTypesArr = array(
                        0 => array(
                            'id' => '1',
                            'text' => 'Architecture Requirement',
                            'abbrev' => 'AR'
                        ),
                        1 => array(
                            'id' => '2',
                            'text' => 'Concept Architectural Specification',
                            'abbrev' => 'CAS'
                        ),
                        2 => array(
                            'id' => '3',
                            'text' => 'Detailed Architecture',
                            'abbrev' => 'DA'
                        ),
                        3 => array(
                            'id' => '4',
                            'text' => 'External Requirements',
                            'abbrev' => 'ER'
                        ),
                        4 => array(
                            'id' => '5',
                            'text' => 'Product Architectural Specification',
                            'abbrev' => 'PAS'
                        ),
                        5 => array(
                            'id' => '6',
                            'text' => 'Regression Strategies',
                            'abbrev' => 'RS'
                        ),
                        6 => array(
                            'id' => '7',
                            'text' => 'Software Interface Specification',
                            'abbrev' => 'SIS'
                        ),
                        7 => array(
                            'id' => '8',
                            'text' => 'Statement of Work',
                            'abbrev' => 'SOW'
                        ),
                        8 => array(
                            'id' => '9',
                            'text' => 'User Experience',
                            'abbrev' => 'UX'
                        )
        );

        return response()->json($docTypesArr);

    }

}
