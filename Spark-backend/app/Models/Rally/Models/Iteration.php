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

class Iteration extends GenericModel {


    public function __construct($arData = null) {
        parent::__construct($arData);
    }
    
    /**
     * Returns list of Iteration for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $Fetch
     *   The Fetch is a string value which determines the attributes present on the objects returned
     * @return array that contains list of all Iterations 
     */
    public static function ListIterations($Project, $Fetch= ""){
        $Result = array();
        $Iterations = Spark::getInstance()->find('Iteration', "(Project.Name = \"{$Project}\")", '', $Fetch);
        $IterationCount = count($Iterations);
        for ($i=0; $i< $IterationCount; $i++){
            $Result[$i] = new \stdClass();
            $Result[$i] = $Iterations[$i]['_refObjectName'];
        }
        // Add "All" Value to Iteration List
        $Result[$IterationCount] = "all";
        array_multisort($Result);
        return $Result;
    }
    
    /**
     * Returns list of Iteration with complete objects for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $Fetch
     *   The Fetch is a string value which determines the attributes present on the objects returned
     * @return [array] that contains list of all Iterations along with its objects
     */
    public static function ListIterationWithDetails($Project, $Fetch = ""){
        $Result = array();
        $Iterations = Spark::getInstance()->find('Iteration', "(Project.Name = \"{$Project}\")", '', $Fetch);
        $IterationCount = count($Iterations);
        for ($i=0; $i< $IterationCount; $i++){
            $Result[$i] = $Iterations[$i];
        }
        return $Result;
    }
    
    /**
     * Returns  Iteration with objects when name of iteration is given 
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @param string $IterationName
     *   The IterationName is the name of the iteration
     * @return [array] that contains the  Iteration along with its objects
     */
    public static function FindIterationName($Project,$IterationName){
        $IterationsArray = Spark::getInstance()->find('Iteration', "(Project.Name = \"{$Project}\")", '','');
        foreach ($IterationsArray as $Iteration){
            if ($Iteration['_refObjectName'] == $IterationName){
                $Result = $Iteration;
            }
        }
        return $Result;
    }
    
    /**
     * Returns  Current Iteration Name based on current date 
     * 
     * @return [String] that contains the current Iteration along with its objects
     */
    public static function GetCurrentIteration(){
        $IterationsArray = Spark::getInstance()->find('Iteration', '', '','EndDate,_refObjectName');
        $CurrentIterationDate = 0;
        $CurrentIteration = "";
        $TodayDateString = new \DateTime();
        $TodayDate = strtotime($TodayDateString->format("m/d/Y"));
        for($i=0; $i<count($IterationsArray); $i++){
            $EndDate = new \DateTime($IterationsArray[$i]['EndDate']);
            if ($TodayDate <= strtotime($EndDate->format("m/d/Y"))){
                if ($CurrentIterationDate == 0 || strtotime($EndDate->format("m/d/Y")) <= $CurrentIterationDate){
                    $CurrentIterationDate = strtotime($EndDate->format("m/d/Y"));
                    $CurrentIteration = $IterationsArray[$i]['_refObjectName'];
                }
            }
        }
        return $CurrentIteration;
    }

}
