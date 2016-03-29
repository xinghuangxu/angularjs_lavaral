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
    
    /**
     * Returns list of Owners along with their objects  for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return array that contains list of all Owners along with their objects
     */
    public static function GetOwners($Project){
        $OwnerList = array();
        $ProjectDetails = Spark::getInstance()->find('Project',"(Name = \"{$Project}\")",'','ObjectID');
        $OwnerList = Spark::getInstance()->get('Project', $ProjectDetails[0]['ObjectID'], 2);
        return $OwnerList['Results'];
    }
    
    /**
     * Returns all Owners names only for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return array that contains list of all Owners Names in alphabetical order
     */
    public static function ListOwnersByDisplayName($Project){
        $OwnerList = self::GetOwners($Project);
        for ($i=0; $i< count($OwnerList); $i++){
            $OwnerList[$i] = $OwnerList[$i]['DisplayName'];
        }
        return self::_SortResult($OwnerList);
    }
    
    /**
     * Returns only Ownername by taking owner emailID as input
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $OwnerEmail
     *   The OwnerEmail is emailID of a owner
     * @return String that contains Owners Name
     */
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
    
    /**
     * Returns only single Owner along with its object  by taking owner name as input
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $OwnerName
     *   The OwnerName is Name of the owner
     * @return array that contains Owner along with its objects
     */
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
    
    /**
     * Returns data sorted in alphabetical order
     *
     * @param array $Result
     *   The result is the data to be sorted in alphabetical order
     * @return array that contains data sorted in alphabetical order
     */ 
    private static function _SortResult($Result){
        array_multisort($Result);
        array_unshift($Result, "No Owner");
        return $Result;
    }

}
