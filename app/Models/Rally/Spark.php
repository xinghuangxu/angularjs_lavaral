<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Rally;

use Spark\Models\Rally\Rally;

class Spark extends Rally{

    // Curl Object
    protected $_curl;
    // Rally's Domain
    protected $_domain;
    // Just for debugging
    protected $_debug = false;
    // Some fancy user agent here
    protected $_agent = 'PHP - Rally Api - 2.0';
    // Current API version
    protected $_version = 'v2.0';
    // Current Workspace
    protected $_workspace;
    // These headers are required to get valid JSON responses
    protected $_headers_request = array(
      'Content-Type: text/javascript'
    );
    // Silly object translation
    protected $_objectTranslation = array(
          'story' => 'hierarchicalrequirement',
      'userstory' => 'hierarchicalrequirement',
        'feature' => 'portfolioitem/feature',
     'initiative' => 'portfolioitem/initiative',
          'theme' => 'portfolioitem/theme',
    );

    private static $instance = null;

    private $_pagesize = 200;

    public static function getInstance($username = "", $password = "") {
        if (!isset(self::$instance)) {
            if ($username && $password) {
                self::$instance = new Spark($username, $password);
            } else {
                // Create new instance from envrionment with read-only user
//                self::$instance = new Spark(env('RALLY_API_USERNAME'), env('RALLY_API_PASSWORD'));
                self::$instance = new Spark("aaali@wichita.edu", "4ym4n4hm4d");
            }
        }
        return self::$instance;
    }

    public function __construct($username, $password, $domain = 'rally1.rallydev.com') {
        $this->_domain = $domain;


        $this->_curl = curl_init();

        set_time_limit(0);
        //ini_set('display_errors', '0');
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
        $user_data = $this->find('user', "(EmailAddress = \"{$username}\")");
        $security_data = $this->_getSecurityToken('security/authorize');
        //print_r($security_data);

        // global $token;
        $this->_securityToken = $security_data['SecurityToken'];

        $this->_user = $user_data[0];
    }

    private function _getSecurityToken($object)
    {
        $object = $this->_get($this->_addWorkspace("{$object}"));
        //        print_r("Security Key:");
        //        print_r($object);
        return $object;
    }

    public function find($object, $query, $order = '', $fetch = '') {
        $object = $this->_translate($object);
        $params = array(
          'query' => $query,
          //'fetch' => ($fetch ? 'true' : 'false'),
          'fetch' => $fetch,
          'pagesize' => 100,
          'start' => 1,
        );
        if (!empty($order)) {
          $params['order'] = $order;
        }
        // Loop through and ask for results
        $results = array();
        for (;;) { // I hate infinite loops
          $objects = $this->_get($this->_addWorkspace("{$object}", $params));
          $results = array_merge($results, $objects['Results']);
          // Continue only if there are more
          if ($objects['TotalResultCount'] > 99 + $params['start']) {
            $params['start'] += 100;
            continue;
          }
          // We're done, break
          break;
        }
        return $results;
      }

      public function get($object, $id, $whichExecute = 1) {
          if (isset($whichExecute) && $whichExecute == 2){
              return $this->_get($this->_addWorkspace($this->getRef($object, $id)),2);
          }
          elseif(isset($whichExecute) && $whichExecute == 3){
              return $this->_get($this->_addWorkspace($this->getRef($object, $id)),3);
          }
          else {
              $Ref = $this->getRef($object, $id);
              $WorkSpace = $this->_addWorkspace($Ref);
              $Get = $this->_get($WorkSpace);
              return reset($Get);
          }
      }

      protected function _get($method, $whichExecute = 1) {
        $this->_setopt(CURLOPT_CUSTOMREQUEST, 'GET');
        $this->_setopt(CURLOPT_POSTFIELDS, '');
        if (isset($whichExecute) && $whichExecute ==2){
            return $this->_ExecuteMembers($method."?key={$this->_securityToken}");
        }
        elseif (isset($whichExecute) && $whichExecute == 3){
            return $this->_executeTask($method);
        }
        else{
            return $this->_execute($method."?key={$this->_securityToken}");
        }
      }


      protected function _ExecuteMembers($method){
        $method = ltrim($method, '/');
        $PrepareKey = explode("?", $method);
        $Key = $PrepareKey[1];
        $method = $PrepareKey[0];
        $url = "https://{$this->_domain}/slm/webservice/{$this->_version}/{$method}/TeamMembers?{$Key}";
        $this->_setopt(CURLOPT_URL, $url);
        $response = curl_exec($this->_curl);
        if (curl_errno($this->_curl)) {
            throw new RallyApiException(curl_error($this->_curl));
        }
        $info = curl_getinfo($this->_curl);
        return $this->_result($response, $info);
      }

      protected function _setopt($option, $value) {
        curl_setopt($this->_curl, $option, $value);
      }

      protected function _execute($method) {
        $method = ltrim($method, '/');
        $url = "https://{$this->_domain}/slm/webservice/{$this->_version}/{$method}";
        $this->_setopt(CURLOPT_URL, $url);
        $response = curl_exec($this->_curl);
        if (curl_errno($this->_curl)) {
         throw new RallyApiException(curl_error($this->_curl));
        }
        $info = curl_getinfo($this->_curl);
        return $this->_result($response, $info);
      }

      public function getChildren($object, $id) {
        return $this->_getChildren($this->_addWorkspace($this->getRef($object, $id)));
        //error_reporting(E_STRICT);
     }

     protected function _getChildren($method) {
        $this->_setopt(CURLOPT_CUSTOMREQUEST, 'GET');
        $this->_setopt(CURLOPT_POSTFIELDS, '');
        //PRINT_R($method);
        return $this->_executeChildren($method);
    }

    protected function _getTasks($method){
        $this->_setopt(CURLOPT_CUSTOMREQUEST, 'GET');
        $this->_setopt(CURLOPT_POSTFIELDS, '');
        //PRINT_R($method);
        return $this->_executeTask($method);
    }


    protected function _executeChildren($method) {
        $startIndex = 1;
        $pageSize = $this->_pagesize;
        $totalCount = 1000000;
        $arrayResult = array();
        while ($totalCount >= $startIndex) {
            $method = ltrim($method, '/');
            $url = "https://{$this->_domain}/slm/webservice/{$this->_version}/{$method}/children?fetch=PlanEstimate,c_ArchitecturalTopicID,iteration,_refObjectUUID,DirectChildrenCount,ScheduleState,AcceptedDate&start=$startIndex&pagesize=" . $this->_pagesize;
            // print_r($url);
            $this->_setopt(CURLOPT_URL, $url);               //print_r("URL-leonx:");
            $response1 = curl_exec($this->_curl);
            if (curl_errno($this->_curl)) {
                throw new RallyApiException(curl_error($this->_curl));
            }
            $info = curl_getinfo($this->_curl);
            $result = $this->_result($response1, $info);
            $totalCount=$result['TotalResultCount'];
            $pageResult=$result['Results'];
            foreach($pageResult as $r){
                $arrayResult[]=$r;
            }
            $startIndex+=$pageSize;
        }
        return $arrayResult;
    }

    protected function _executeTask($method){
        $method = ltrim($method, '/');

        $url = "https://{$this->_domain}/slm/webservice/{$this->_version}/{$method}/Tasks?fetch=_refObjectName,State";
       // print_r($url);
        $this->_setopt(CURLOPT_URL, $url);               //print_r("URL-leonx:");

        $response = curl_exec($this->_curl);

        //echo $response;
        //return $response;
        if (curl_errno($this->_curl)) {
            throw new RallyApiException(curl_error($this->_curl));
        }


        $info = curl_getinfo($this->_curl);
            // print_r("Response-Leonx");

        // $object = json_decode($response, true);
        //print_r($object);
        return $this->_result($response, $info);
    }

    public function delete($object, $id) {
        $url = $this->_addWorkspace($this->getRef($object, $id));
        // There are no values that return here
        $this->_delete($url);
        return true;
      }
}

