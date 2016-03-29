<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\Rally\Models;

use Spark\Models\Rally\Spark;

class Task extends GenericModel {


    /**
     * <constructor>
     *
     * [@param  [array] <$arData> <data row data>]

     */
    public function __construct($arData = null) {
        parent::__construct($arData);
    }
    
    /**
     * Returns the ObjectName.
     *
     * @return [string] which has object name
     */
    public function getName() {
        return $this->data['_refObjectName'];
    }
    
    /**
     * Returns the ObjectID.
     *
     * @return [string] which has object ID
     */
    public function getId() {
        return $this->data['_refObjectUUID'];
    }
    
    /**
     * Returns list of all tasks that are created by a particular owner
     *
     * @param string $name
     *   The name is name of the owner in Rally
     * @return [array] that contains list of all tasks 
     */
    public static function findWithOwnerName($name) {
        $result = array();
        $tasks = Spark::getInstance()->find("task", "(Owner.Name = $name)", '', "true");
        foreach ($tasks as $task) {
            $result[] = new Task($task);
        }
        return $result;
    }
    
    /**
     * This function Creates the task 
     *
     * @param [array]  $Info
     *   The $Info has all the data to create a task
     * @return void
     */
    public static function CreateTask($Info){
        $CreateInfo = array();
        $CreateInfo['WorkProduct'] = Spark::getInstance()->get('HierarchicalRequirement',$Info['StoryID']);
        if ($Info['title'] != ""){
            $CreateInfo['Name'] = $Info['title'];
        }
        if ($Info['owner'] != "" && $Info['owner'] != "No Owner"){
            $CreateInfo['Owner'] = Member::FindOwnerByName($Info['project'], $Info['owner']);
        }
        if ($Info['estimate'] != ""){
            $CreateInfo['Estimate'] = $Info['estimate'];
        }
        if ($Info['Desc'] != ""){
            $CreateInfo['Description'] = $Info['Desc'];
        }
        Spark::getInstance()->create('Task', $CreateInfo);
    }
    
    /**
     * This function Updates the task 
     *
     * @param [array] $Info
     *   The $Info has all the data to udpate a task
     * @return void
     */
    public static function UpdateTask($Info){
        $UpdateInfo = array();
        if ($Info['title'] != ""){
            $UpdateInfo['Name'] = $Info['title'];
        }
        if ($Info['owner'] != "" && $Info['owner'] != "No Owner"){
            $UpdateInfo['Owner'] = Member::FindOwnerByName($Info['project'], $Info['owner']);
        }
        if ($Info['estimate'] != ""){
            $UpdateInfo['Estimate'] = $Info['estimate'];
        }
        if ($Info['Desc'] != ""){
            $UpdateInfo['Description'] = $Info['Desc'];
        }
        Spark::getInstance()->update('task', $Info['TaskID'], $UpdateInfo);
    }
    
    /**
     * This function Delete the task 
     *
     * @param [string] $TaskID
     *   The $TaskID is unique objectID of a task
     * @return void
     */
    public static function DeleteTask($TaskID){
        Spark::getInstance()->delete('task', $TaskID);
    }
    
    /**
     * Returns Object details of a task
     *
     * @param [string] $TaskID
     *   The $TaskID is unique objectID of a task
     * @return [array] that contains object details of a task
     */
    public static function TaskDetails($TaskID){
        $Result = Spark::getInstance()->get('task', $TaskID);
        return $Result;
    }
    
    /**
     * Returns list of task names and their states for a particular user story
     *
     * @param [string] $UserStory
     *   The $UserStory is unique objectID of a userstory
     * @return [array] that contains list of task names and their states 
     */
    public static function ListTasks($UserStory){
        $TasksArray = Spark::getInstance()->get('HierarchicalRequirement', $UserStory, 3); // 3 mean to choose the execution for tasks
        $Tasks = array();
        for ($i=0; $i<count($TasksArray['Results']); $i++){
            $Tasks[$i]['TaskName'] = $TasksArray['Results'][$i]['_refObjectName'];
            $Tasks[$i]['State'] = $TasksArray['Results'][$i]['State'];
        }
        return $Tasks;
    }

    public function toHtmlRow(){
        return "<tr class=\"ts\"> ".$this->toTd(array(
            $this->FormattedID,$this->Name,$this->State
        ))."</tr>";
    }

    public function toTd($fields){
        $tds="";
        foreach($fields as $f){
            $tds.="<td style='padding-right: 10px;'>".$f."</td>";
        }
        return $tds;
    }

    /**
     * <output to json format>
     *
     * [@return <array> <array representation of TestRun Object>]
     */
    public function toArray() {
        return $this->data;
    }

}
