<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Rally;

use Spark\Models\Rally\Spark;

/**
 * Rally Lookback API Connector
 *
 * Simple class for interacting with RallyDev Lookback web services
 *
 * @version 2.0
 * @author  Leon Xu <xinghuangxu@gmail.com>
 *
 */

class RallyLookBack {

    // Curl Object
    private $_curl;
    // Rally's Domain
    private $_domain;
    // Just for debugging
    private $_debug = false;
    // Some fancy user agent here
    private $_agent = 'PHP - Rally Api - 1.4';
    // Current API version
    private $_version = 'v2.0';
    // Current Workspace
    private $_workspaceId;
    // These headers are required to get valid JSON responses
    private $_headers_request = array('Content-Type: text/java_script');

    /**
     * Wrapper for curp_setopt
     *
     * @param string $option
     *   the CURLOPT_XXX option to set
     * @param varied $value
     *   the value
     */
    protected function _setopt($option, $value) {
        curl_setopt($this->_curl, $option, $value);
    }

    public function query($params) {
        $this->_setopt(CURLOPT_CUSTOMREQUEST, 'GET');
        $this->_setopt(CURLOPT_POSTFIELDS, '');
        return $this->_execute($this->parseArrayToUrlParam($params));
    }

    public function parseArrayToUrlParam($params){
        $urlParam="";
        foreach($params as $key=>$value){
           if($urlParam){
               $urlParam.="&";
           }
           $realvalue="";
           if(is_array($value)){
               if(array_key_exists('0',$value)){ //number array param
                   $realvalue="[";
                   foreach($value as $v){
                       $realvalue.=("\"".$v."\",");
                   }
                   $realvalue=substr($realvalue, 0,-1);
                   $realvalue.="]";
               }else{ //hash table param
                   $realvalue="{";
                   foreach($value as $k=>$v){
                       $realvalue.= $k.":".$v.",";
                   }
                   $realvalue=substr($realvalue, 0,-1);
                   $realvalue.="}";
               }
           }else{
               $realvalue=$value;
           }
           $urlParam.=($key."=".$realvalue);
        }
        return $urlParam;
    }

    /**
     * Execute the Curl object
     *
     * @param string $method
     *   Method of the API to execute
     * @return array
     *   API return data
     * @throws RallyApiException
     *   On Curl errors
     */
    protected function _execute($urlParam) {
        //$method = ltrim($method, '/');
        //$url = "https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/2930602434/artifact/snapshot/query.js?find={%22ObjectID%22:28089192645}&fields=true&start=0&pagesize=100&limit=10";
        $url = "https://{$this->_domain}/analytics/{$this->_version}/service/rally/workspace/$this->_workspaceId/artifact/snapshot/query.js?$urlParam";
        $this->_setopt(CURLOPT_URL, $url);
        $response = curl_exec($this->_curl);
        if (curl_errno($this->_curl)) {
            throw new RallyApiException(curl_error($this->_curl));
        }
        $info = curl_getinfo($this->_curl);
        //return new LookBackObject(json_decode($response, true), $info);
        return array(json_decode($response, true), $info);
    }

    /**
     * Create Rally Api Object
     *
     * @param string $username
     *   The username for Rally
     * @param string $password
     *   The password for Rally (probably hunter2)
     * @param string $domain
     *   Override for Domain to talk to
     */
    public function __construct($username, $password, $domain = 'rally1.rallydev.com') {
        $this->_domain = $domain;
        $this->_curl = curl_init();
        set_time_limit(0);
        $this->_setopt(CURLOPT_RETURNTRANSFER, true);
        $this->_setopt(CURLOPT_HTTPHEADER, $this->_headers_request);
        $this->_setopt(CURLOPT_VERBOSE, $this->_debug);
        $this->_setopt(CURLOPT_USERAGENT, $this->_agent);
        $this->_setopt(CURLOPT_HEADER, 0);
        $this->_setopt(CURLOPT_SSL_VERIFYHOST, 0);
        $this->_setopt(CURLOPT_SSL_VERIFYPEER, 0);
        $this->_setopt(CURLOPT_COOKIEJAR, dirname(__file__) . '/cookie.txt');
        // Authentication
        $this->_setopt(CURLOPT_USERPWD, "$username:$password");
        $this->_setopt(CURLOPT_HTTPAUTH, CURLAUTH_ANY);

        // Validate Login was Successful
        $this->_setWorkSpace();
    }

    private function _setWorkSpace() {
        $workspace = Spark::getInstance()->find('workspace', "", "", "true");
        $this->_workspaceId = $workspace[0]['ObjectID'];
    }

}
