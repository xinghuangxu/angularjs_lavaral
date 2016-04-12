<?php

namespace Spark\Http\Controllers\sis;

use Illuminate\Http\Request;

use Spark\Http\Requests;
use Spark\Http\Controllers\Controller;

class rccaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $serviceURL = 'http://10.16.19.61/rcca_api/';
        $editorData = json_encode($request->all());
        $handler = curl_init($serviceURL);
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
