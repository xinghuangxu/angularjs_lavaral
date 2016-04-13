<?php

namespace Spark\Http\Controllers\SIS;

use Illuminate\Auth\Access\Response;
use Illuminate\Http\Request;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;

class tsController extends Controller
{
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        header('Access-Control-Allow-Credentials: true');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, Response $response)
    {
        $editorData = json_encode($request->all());
        $handler = curl_init(env('SIS_ENDPOINT_TS'));
        curl_setopt($handler, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($handler, CURLOPT_POSTFIELDS, $editorData);
        curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handler, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($editorData))
        );
        $result = curl_exec($handler);

        return $result;
    }
}
