<?php namespace Spark\Utils;

require __DIR__ . "/../../vendor/autoload.php";
use Monolog\Logger;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Request;

class Elmo {
    /**
    * Take as input the error message and logs a warning message using monolog
    *
    * @param  string $message
    * @return void;
    */
    private function logToMonolog($message)
    {
        $log = new Logger('ELMO_Post_Error');
        $handler = new StreamHandler('../../../storage/logs/elmo.log');
        $handler -> setFormatter(new LineFormatter(null, null, true, true));
        $log -> pushHandler($handler);
        $log -> addWarning($message);
    }

    /**
     * Take as input the username and put together the array data that needs to be
     * sent to ELMO.  Return the array data back from the function.
     *
     * @param  string  $sparkUser
     * @return array $data
     */
    public static function getPageTrackingData($sparkUser) {
        date_default_timezone_set("America/Chicago");
        $date = date(DATE_ATOM);
        $pageAccessed = $_SERVER['PHP_SELF'];
        $originHostname = $_SERVER['SERVER_NAME'];
        $queryString = "No query string specified";

        if (isset($_SERVER['QUERY_STRING'])) {
            $queryString = $_SERVER['QUERY_STRING'];
        }

        $data = array (
            'event' => array (
                'application' => 'spark',
                'interface' => 'UI',
                'action' => $pageAccessed,
                'username' => $sparkUser,
                'start' => $date,
                'duration' => '0',
                'hostname' => $originHostname,
                'detail' => array (
                    array (
                        'name' => 'Query String',
                        'value' => $queryString
                    )
                )
            )
        );
        return $data;
    }


    /**
     * Take as input the username and put together the array data that needs to be
     * sent to ELMO.  Return the array data back from the function.
     *
     * @param  string  $sparkUser
     * @return array $data
     */
    public static function getRestApiTrackingData($sparkUser) {
        date_default_timezone_set("America/Chicago");
        $date = date(DATE_ATOM);
        $pageAccessed = Request::path();
        $originHostname = $_SERVER['SERVER_NAME'];
        $queryString = "No query string specified";

        if (isset($_SERVER['QUERY_STRING'])) {
            $queryString = $_SERVER['QUERY_STRING'];
        }

        $data = array (
            'event' => array (
                'application' => 'spark',
                'interface' => 'REST-API',
                'action' => $pageAccessed,
                'username' => $sparkUser,
                'start' => $date,
                'duration' => '0',
                'hostname' => $originHostname,
                'detail' => array (
                    array (
                        'name' => 'Query String',
                        'value' => $queryString
                    )
                )
            )
        );
        return $data;
    }

    /**
    * Take as input the json encoded data and post it as an entry to ELMO. Log a Monolog
    * error if the post times out or is unsuccessful
    *
    * @param  json data $content
    * @return void;
    */
    public static function postToElmo($content)
    {
        if(getenv("APP_ENV") == "beta" || getenv("APP_ENV") == "live")
            $url = 'http://elmo.eng.netapp.com/collector/';
        else
            $url = 'http://elmo-dev.eng.netapp.com/collector/';

        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
        curl_setopt($curl, CURLOPT_TIMEOUT, 2);

        $json_response = curl_exec($curl);
        if($json_response != false) {
            $response = json_decode($json_response, true);
            $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            if ($status != 200) {
                $message = "ELMO UPLOAD failed with STATUS: " . $status .
                ", RESPONSE: " . $json_response . ", CURL_ERROR: " .curl_error($curl) .
                ", CURL_ERRNO: " . curl_errno($curl . "\n");
                (new Elmo) -> logToMonolog($message);
            }
        }
        else {
            $message = "Connection to ELMO timed out after 2 seconds.";
            (new Elmo) -> logToMonolog($message);
        }

        curl_close($curl);
    }
}