<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2015-12-14
 */

namespace Spark\Utils;

class utilFunctions {

    /**
     * Generate a response for requests
     *
     * @param $responseType {string} Response Type to be created
     * @return {object} Response object for the calling controller to send to the user
     */
    public static function createResponse($responseType) {

        switch($responseType)
        {
            case "unauthorized":
                //Generate a 'not authorized' response for requests which requires certain permissions
                $responseArr = array(
                                    "code" => "401",
                                    "message" => "unauthorized"
                                );
                break;

        }

        return $responseArr;
    }

}

?>