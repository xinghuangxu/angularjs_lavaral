<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Rally\Models;

use Spark\Models\Rally\Spark;

/**
 * @abstract A representation of Test Run Data Row in Test Run Table
 * @author Leonx
 * @copyright 2014 NetApp, Inc.
 * @version 1.0.0
 *
 */

class Release extends GenericModel {



    /**
     * <constructor>
     *
     * [@param  [array] <$arData> <data row data>]

     */
    public function __construct($arData = null) {
        parent::__construct($arData);
    }

    public static function ListReleases($Project){
        $Result = array();
        $Releases = Spark::getInstance()->find('Release', "(Project.Name = \"{$Project}\")", '', '');
        $ReleasesCount = count($Releases);
        for ($i=0; $i< $ReleasesCount; $i++){
            $Result[$i] = new \stdClass();
            $Result[$i] = $Releases[$i]['_refObjectName'];
        }
        $Result[$ReleasesCount] = "all";
        array_unshift($Result, "No Release");
        array_multisort($Result);
        return $Result;
    }

    public static function FindReleaseName($Project, $ReleaseName){
        $ReleasesArray = Spark::getInstance()->find('Release', "(Project.Name = \"{$Project}\")", '','');
        foreach ($ReleasesArray as $Release){
            if ($Release['_refObjectName'] == $ReleaseName){
                $Result = $Release;
            }
        }
        return $Result;
    }

}
