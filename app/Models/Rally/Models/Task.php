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

    public function getName() {
        return $this->data['_refObjectName'];
    }

    public function getId() {
        return $this->data['_refObjectUUID'];
    }

    public static function findWithOwnerName($name) {
        $result = array();
        $tasks = Spark::getInstance()->find("task", "(Owner.Name = $name)", '', "true");
        foreach ($tasks as $task) {
            $result[] = new Task($task);
        }
        return $result;
    }

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

    public static function DeleteTask($TaskID){
        Spark::getInstance()->delete('task', $TaskID);
    }

    public static function TaskDetails($TaskID){
        $Result = Spark::getInstance()->get('task', $TaskID);
        return $Result;
    }

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
