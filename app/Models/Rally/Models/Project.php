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

class Project extends GenericModel {

    // Chosen Project
    private static $_Project;

    // An array of the final Iteration details
    private static $_IterationDetails = array();

    // An array of All Iterations in the chosen project
    private static $_IterationList = array();

    /* An array of all Userstories in the chosen project
     * we fetch all user stories because plan estimation, total task estimation, total remaining task, and Actuals are releated to the user story not the iteration
     */
    private static $_UserStories = array();


    public function __construct($arData = null) {
        parent::__construct($arData);
    }
    
    /**
     * Set Project Property
     * 
     */
    private static function _SetProject($Project){
        self::$_Project = $Project;
    }
    
    /**
     * Returns list of all projects in Rally
     * 
     * @return [array] that contains list of all projects in alphabetical order 
     */
    public static function ListProjects(){
        $Result = array();
        $ProjectList = Spark::getInstance()->find('Project', '', '', 'ScheduleState,HasParent,Parent');
        $ProjectCounter = count($ProjectList);
        for ($i=0; $i< $ProjectCounter; $i++){
            $Result[$i] = new \stdClass();
            $Result[$i] = $ProjectList[$i]['_refObjectName'];
        }
        array_multisort($Result);
        return $Result;
    }
    
    /**
     * Returns list of Iteration with  object details  for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return [array] that contains list of all Iterations along with its objects
     */
    private static function _ListProjectIteration(){
        //$IterationResult = $this->_Rally->find("Iteration", "(Project.Name = \"{$this->_Project}\")", "", );
        $IterationResult = Iteration::ListIterationWithDetails(self::$_Project, 'PlannedVelocity,StartDate,EndDate');
        $Index = 0;
        for ($i=0; $i < count($IterationResult); $i++){
            $StartDate = new \DateTime($IterationResult[$i]['StartDate']);
            $EndDate = new \DateTime($IterationResult[$i]['EndDate']);
            self::$_IterationList[$Index] = $IterationResult[$i]['_refObjectName'];
            self::$_IterationDetails[$Index]['Name'] = $IterationResult[$i]['_refObjectName'];
            self::$_IterationDetails[$Index]['StartDate'] = $StartDate->format("m/d/Y h:m:s");
            self::$_IterationDetails[$Index]['EndDate'] = $EndDate->format("m/d/Y h:m:s");
//            self::$_IterationDetails[$Index]['StartDate'] = $StartDate->format("m/d/Y");
//            self::$_IterationDetails[$Index]['EndDate'] = $EndDate->format("m/d/Y");
            self::$_IterationDetails[$Index]['PlanVelocity'] = $IterationResult[$i]['PlannedVelocity'];
            self::$_IterationDetails[$Index]['PlanEstimate'] = 0;
            self::$_IterationDetails[$Index]['TaskEstimateTotal'] = 0;
            self::$_IterationDetails[$Index]['TaskRemainingTotal'] = 0;
            self::$_IterationDetails[$Index]['Actuals'] = 0;
            $Index++;
            unset($StartDate);
            unset($EndDate);
        }
    }
    
    /**
     * Returns list of user stories that belong to particular iteration  for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return [array] that contains list of user stories that belong to particular iteration  for a particular project
     */
    private static function _ListProjectUserStories(){
        // = $this->_Rally->find('userstory', ,'', );
        $Project = self::$_Project;
        $AllUserStories = UserStory::findWithParams("(Project.Name = \"{$Project}\")", "", 'Iteration,TaskActualTotal,TaskEstimateTotal,TaskRemainingTotal,PlanEstimate');
        $Index = 0;
        for ($i=0; $i <count(self::$_IterationList);$i++){
            for ($l=0; $l<count($AllUserStories); $l++){
                if ($AllUserStories[$l]['Iteration']['_refObjectName'] == self::$_IterationList[$i]){
                    self::$_UserStories[$Index] = $AllUserStories[$l];
                    $Index++;
                }
            }
        }
    }
    
    /**
     * Returns details such as PlanEstimate,TaskEstimateTotal,TaskRemainingTotal and Actuals for iterations of a particular project
     * 
     * @return [array] that contains details such as PlanEstimate,TaskEstimateTotal,TaskRemainingTotal and Actuals for iterations of a particular project
     */
    private static function _GetIterationTotals(){
        self::_ListProjectIteration();
        self::_ListProjectUserStories();
        for ($i=0; $i< count(self::$_IterationDetails); $i++){
            for ($l=0; $l<count(self::$_UserStories); $l++){
                if (self::$_UserStories[$l]['Iteration']['_refObjectName'] == self::$_IterationDetails[$i]['Name']){
                    self::$_IterationDetails[$i]['PlanEstimate'] = self::$_IterationDetails[$i]['PlanEstimate'] + self::$_UserStories[$l]['PlanEstimate'];
                    self::$_IterationDetails[$i]['TaskEstimateTotal'] = self::$_IterationDetails[$i]['TaskEstimateTotal'] + self::$_UserStories[$l]['TaskEstimateTotal'];
                    self::$_IterationDetails[$i]['TaskRemainingTotal'] = self::$_IterationDetails[$i]['TaskRemainingTotal'] + self::$_UserStories[$l]['TaskRemainingTotal'];
                    self::$_IterationDetails[$i]['Actuals'] = self::$_IterationDetails[$i]['Actuals'] + self::$_UserStories[$l]['TaskActualTotal'];
                }
            }
        }
    }
    
    /**
     * Returns list of Iteration with  object details  for a particular project
     *
     * @param string $Project
     *   The ProjectName in Rally
     * @return [array] that contains list of all Iterations along with its objects
     */
    public static function GetIterationTable($Project){
        self::_SetProject($Project);
        self::_GetIterationTotals();
        return self::$_IterationDetails;
    }
}
