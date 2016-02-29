<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Rally\Models;

use Spark\Models\Rally\Spark;

class Member extends GenericModel {


    public function __construct($arData = null) {
        parent::__construct($arData);
    }

    public static function GetOwners($Project){
        $OwnerList = array();
        $ProjectDetails = Spark::getInstance()->find('Project',"(Name = \"{$Project}\")",'','ObjectID');
        $OwnerList = Spark::getInstance()->get('Project', $ProjectDetails[0]['ObjectID'], 2);
        return $OwnerList['Results'];
    }

    public static function ListOwnersByDisplayName($Project){
        $OwnerList = self::GetOwners($Project);
        for ($i=0; $i< count($OwnerList); $i++){
            $OwnerList[$i] = $OwnerList[$i]['DisplayName'];
        }
        return self::_SortResult($OwnerList);
    }

    public static function FindOwnerByEmail($Project, $OwnerEmail){
        $OwnerList = self::GetOwners($Project);
        $MatchOwner = "";
        for ($i=0; $i< count($OwnerList); $i++){
            if ($OwnerList[$i]['EmailAddress'] == $OwnerEmail){
                $MatchOwner = $OwnerList[$i]['DisplayName'];
                break;
            }
        }
        return $MatchOwner;
    }

    public static function FindOwnerByName($Project, $OwnerName){
        $OwnerList = self::GetOwners($Project);
        for ($i=0; $i< count($OwnerList); $i++){
            if ($OwnerList[$i]['_refObjectName'] == $OwnerName){
                $Owner = new \stdClass();
                $Owner = $OwnerList[$i];
                return $Owner;
            }
        }
    }

    private static function _SortResult($Result){
        array_multisort($Result);
        array_unshift($Result, "No Owner");
        return $Result;
    }

}
