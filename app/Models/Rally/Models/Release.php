<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-03-11
 */

namespace Spark\Models\Rally\Models;

use Spark\Models\Rally\Spark;

class Release extends GenericModel {

    /**
     * <constructor>
     *
     * [@param  [array] <$arData> <data row data>]

     */
    public function __construct($arData = null) {
        parent::__construct($arData);
    }

    /**
     * Returns list of all Releases for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return [array] that contains list of all Releases
     */
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

    /**
     * Returns  Release with objects when name of Release name is given as input
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $ReleaseName
     *   The ReleaseName is the name of the Release for which object details has to be fetched
     * @return [array] that contains the  Release along with its objects
     */
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
