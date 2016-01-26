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

class UserStory extends GenericModel {

    const API_NAME = "HierarchicalRequirement";

    private static $map = array();

    Private static $_BlockedIcons = array(
        "In-Progress" => "assets/img/icon_In-Progress_Blocked.png",
        "Defined"     => "assets/img/icon_Defined_Blocked.png",
        "Completed"   => "assets/img/icon_Completed_Blocked.png",
        "Accepted"    => "assets/img/icon_Accepted_Blocked.png"
    );

    private static $_Icons = array(
        "In-Progress" => "assets/img/icon_In-Progress.png",
        "Defined"     => "assets/img/icon_Defined.png",
        "Completed"   => "assets/img/icon_Completed.png",
        "Accepted"    => "assets/img/icon_Accepted.png"
    );


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

    public function getChildren() {
        return $this->children;
    }

    public function getParent() {
        if ($this->data['HasParent'] == 1) {
            if (!$this->parent) {
                $this->parent = UserStory::findWithId($this->data['Parent']['_refObjectUUID']);
            }
            return $this->parent;
        }
        return null;
    }

    public static function findWithParams($query, $order, $fetch) {
        $result = array();
        $stories = Spark::getInstance()->find('userstory', $query, $order, $fetch);
        foreach ($stories as $story) {
            //$result[] = new UserStory($story);
            $result[] = $story;
        }
        return $result;
    }

    public static function findWithReleaseName($releaseName) {
        $result = array();
        $stories = Spark::getInstance()->find('userstory', "(Release.Name contains {$releaseName})", '', 'ScheduleState,Iteration,HasParent,Parent,Release,c_ArchitecturalTopicID');
        foreach ($stories as $story) {
            $result[] = UserStory::findWithId($story['_refObjectUUID']);
        }
        return $result;
    }

    public static function findWithId($id) {
        if (array_key_exists($id, self::$map)) {
            return self::$map[$id];
        }
        $story = Spark::getInstance()->get(UserStory::API_NAME, $id);
        self::$map[$id] = $story;
        //self::$map[$id] = new UserStory($story[UserStory::API_NAME]);
        return self::$map[$id];
    }

    public function addChild(UserStory $child) {
        $parentId = $child->getParent()->getId();
        while ($parentId !== $this->getId()) {
            $parent = UserStory::findWithId($parentId);
            $parent->addChild($child);
            $child = $parent;
            $parentId = $child->getParent() ? $child->getParent()->getId() : null;
        }
        if (!array_key_exists($child->getId(), $this->children)) {
            $this->children[$child->getId()] = $child;
        }
    }

    public function toString($indent) {
        $str = '<pre>' . str_repeat(' ', $indent * 3) . $indent . '.' . $this->getName() . "</pre>";
        $indent++;
        foreach ($this->children as $child) {
            $str.=$child->toString($indent);
        }
        return $str;
    }

    /**
     * <find tests meet the query requirements>
     *
     * [@param  [array] <$arg> < values such as count, query>]
     * [@return <array> <an array of TestRun objects]
     */
    public static function find($arg) {
        $us = array();
        $time = isset($arg['time']) ? $arg['time'] : "";
        $query = isset($arg['query']) ? $arg['query'] : "";
        $fetch = isset($arg['fetch']) ? $arg['fetch'] : "";
        $order = isset($arg['order']) ? $arg['order'] : "";
        if($fetch&&$fetch!="true"){
            $fetch.=",CreationDate,LastUpdateDate,ObjectID";
        }
        $results = UserStory::findWithParams($query, $order,$fetch);
        foreach ($results as $us) {
            if(strpos($fetch,'AcceptedPoints')!==FALSE||$fetch=="true"){
                $acceptedPoints= self::getAcceptedPointEst($us, $time);
            }
            self::returnToState($time,$fetch);
            if(isset($acceptedPoints)){
                //$us->AcceptedPoints = $acceptedPoints;
                $us['AcceptedPoints'] = $acceptedPoints;
            }
        }
        //echo "<pre>";print_r($us);echo "</pre>";
        //echo "<br /><pre>";print_r($results);echo "</pre>";
        //$results['AcceptedPoints'] = $us['AcceptedPoints'];
        return $us;
    }

    public static function EQIfind($id, $arg) {
        $arg['query'] = "(ObjectID = \"{$id}\")";
        $arg['fetch'] = "true";
        $us = array();
        $time = isset($arg['time']) ? $arg['time'] : "";
        $query = isset($arg['query']) ? $arg['query'] : "";
        $fetch = isset($arg['fetch']) ? $arg['fetch'] : "";
        $order = isset($arg['order']) ? $arg['order'] : "";
        if($fetch&&$fetch!="true"){
            $fetch.=",CreationDate,LastUpdateDate,ObjectID";
        }
        $results = UserStory::findWithParams($query, $order,$fetch);
        foreach ($results as $us) {
            if(strpos($fetch,'AcceptedPoints')!==FALSE||$fetch=="true"){
                $acceptedPoints= self::getAcceptedPointEst($us, $time);
            }
            self::returnToState($time,$fetch);
            if(isset($acceptedPoints)){
                //$us->AcceptedPoints = $acceptedPoints;
                $us['Title'] = $results[0]['Name'];
                $us['id'] = $results[0]['FormattedID'];
                $us['owner'] = $results[0]['Owner']['_refObjectName'];
                $us['state'] = $results[0]['ScheduleState'];
                if ($results[0]['Release'] != null){
                    $us['release'] = $results[0]['Release']['_refObjectName'];
                }
                else{
                    $us['release'] = null;
                }
                $us['points'] = $results[0]['PlanEstimate'];
                if ($results[0]['Iteration'] != null){
                    $us['iteration'] = $results[0]['Iteration']['_refObjectName'];
                }
                else{
                    $us['iteration'] = null;
                }
                $us['arch'] = $results[0]['c_ArchitecturalTopicID'];
                $us['description'] = $results[0]['Description'];
            }
        }
        //echo "<pre>";print_r($us);echo "</pre>";
        //echo "<br /><pre>";print_r($results);echo "</pre>";
        //$results['AcceptedPoints'] = $us['AcceptedPoints'];
        return $us;
    }

    public static function returnToState($time,$fetch="") {
        if($fetch!="true"){
            $fetch=explode(",",$fetch);
        }
        if (!$time)
            return;
        $time = trim($time);
        $timeStamp = strtotime($time);
        $lastUpdatedDateTimeStamp = strtotime($this->LastUpdateDate);
        $creationTimeStamp = strtotime($this->CreationDate);
        if ($timeStamp < $creationTimeStamp) {
            throw new \Exception("Object has not been created yet at time $time. Object Created At: " . $this->CreationDate);
        }
        if ($timeStamp < $lastUpdatedDateTimeStamp && $timeStamp > $creationTimeStamp) {
            $data = array(
                "find" => array(
                    "ObjectID" => $this->ObjectID,
                    "_ValidFrom" => "{\"\$lte\":\"$time\"}",
                    "_ValidTo" => "{\"\$gt\":\"$time\"}"
                ),
                "fields" => $fetch,//["_ValidFrom","_ValidTo","ObjectID","State"]',
                "pagesize" => 100,
                "limit" => 2,
                "start" => 0
            );
            list($LookbackData, $LookBackInfo) = RallyLookBack::getInstance()->query($data);
            //$lookbackData = RallyLookBack::getInstance()->query($data);
            //$this->data = $lookbackObject->getObjectData(0);
            $this->data = $LookbackData['Results'][0]; //$lookbackObject->getObjectData(0);
        } else {
            $this->_ValidTo = "9999-01-01T00:00:00.000Z";
            $this->_ValidFrom = $this->LastUpdateDate;
        }
    }

    public static function getAcceptedPointEst($userStory, $time) {
        $child = array();
        $c = 0;
//        $Epic_userstories = Rally::getInstance()->find('userstory', "(Name contains   \"$name\")  ", '', 'ScheduleState,Iteration,Children,DirectChildrenCount,Release,PlanEstimate');
//        $EpicUS_PlndPts = $userStory->PlanEstimate; //US plan estimate
        //$ID = $userStory->_refObjectUUID;
        $ID = $userStory['_refObjectUUID'];
        $result = Spark::getInstance()->getChildren('HierarchicalRequirement', "$ID"); //get the childre and store in $Glob_owner
        $b = count($result);
        for ($x = 0; $x < $b; $x++) {
            $child[$c] = $result[$x];
            $c++;
        }
        $CompleteArray = $child;
        $Accepted_Pts = 0;
        $Counter = count($result);
        for ($y = 0; $y < $Counter; $y++) {

            if ($CompleteArray[$y]['DirectChildrenCount'] != 0) {
                $I = $CompleteArray[$y]['_refObjectUUID'];
                $result = Spark::getInstance()->getChildren('HierarchicalRequirement', "/$I");

                //global $Glob_owner;
                for ($i = 0; $i < count($result); $i++) {
                    $CompleteArray[] = $result[$i];
                }

                $Counter = 0;
                $Counter = count($CompleteArray);
            }
        }
        for ($x = 0; $x < count($CompleteArray); $x++) {
            if ($CompleteArray[$x]['DirectChildrenCount'] == 0 && $CompleteArray[$x]['ScheduleState'] ==
                    'Accepted') {
                if ($time) {
                    if (!UserStory::shouldFilterByTime($CompleteArray[$x]['AcceptedDate'], $time)) {
                        $Accepted_Pts = $Accepted_Pts + $CompleteArray[$x]['PlanEstimate'];
                    }
                } else {
//                    UserStory::printStory($CompleteArray[$x]);
                    $Accepted_Pts = $Accepted_Pts + $CompleteArray[$x]['PlanEstimate'];
                }
                //filter based on accepted date
            }
        }
        return $Accepted_Pts;
    }

//    public static function printStory($us){
//        print $us['_refObjectName']." ".$us['ScheduleState']." ".$us['PlanEstimate']."\n";
//    }


    /**
     *
     * [@return true/flase true should be filterd, false otherwise
     */
    public static function shouldFilterByTime($usTime, $filterTime) {
        $usTimeStam = strtotime($usTime);
        $filterTimeStam = strtotime($filterTime);
        $result = "";
        eval(" \$result= ($filterTimeStam < $usTimeStam); ");
        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * <output to json format>
     *
     * [@return <array> <array representation of TestRun Object>]
     */
    public function toArray() {
        return $this->data;
    }

    public static function DeleteUserStory($id){
        // Is It Better to use self::FindWithID
        //$UserStoryInformation = Spark::getInstance()->get('userstory', $id);
        $UserStoryInformation = self::findWithId($id);
        if ($UserStoryInformation['DirectChildrenCount'] == 0){
            //echo "<pre>";print_r($UserStoryInformation);echo "</pre>";
            return Spark::getInstance()->delete('userstory', $id);
        }
        else {
            return "Not Allowed";
        }
    }

    public static function UpdateUserStory($Info){
        $Update = array();
        $UserStoryDetails = self::findWithId($Info['newNodeID']);
        $Update['Name'] = $Info['title'];
        $Update['Description'] = $Info['description'];
        $Update['c_ArchitecturalTopicID'] = $Info['arch'];
        $Update['ScheduleState'] = $Info['state'];
        $Update['PlanEstimate'] = $Info['points'];
        $Update['Iteration'] = Iteration::FindIterationName($Info['project'], $Info['iteration']);
        if ($Info['release'] != "No Release"){
            $Update['Release'] = Release::FindReleaseName($Info['project'], $Info['release']);
        }
        if ($Info['owner'] != "No Owner"){
            $Update['Owner'] = Member::FindOwnerByName($Info['project'], $Info['owner']);
        }
        Spark::getInstance()->update('userstory', $Info['newNodeID'] , $Update);
        if ($UserStoryDetails['Blocked'] == 1){
            $Icon = self::$_BlockedIcons[$Info['state']];
            $UserStoryDetails['Blocked'] = true;
        }
        else{
            self::$_Icons[$Info['state']];
            $UserStoryDetails['Blocked'] = false;
        }
        $Result = array(
            'icon'   => $Icon,
            'Blocked'   => $UserStoryDetails['Blocked']
        );
        return $Result;
    }

    public static function AddUserStory($Info){
        if ($Info['title'] != ''){
           $UserStoryInfo['Name'] = $Info['title'];
        }
        if ($Info['description'] != ''){
            $UserStoryInfo['Description'] = $Info['description'];
        }
        if ($Info['arch'] != ''){
            $UserStoryInfo['c_ArchitecturalTopicID'] = $Info['arch'];
        }
        if ($Info['state'] != ''){
            $UserStoryInfo['ScheduleState'] = $Info['state'];
        }
        if ($Info['points'] != ''){
            $UserStoryInfo['PlanEstimate'] = $Info['points'];
        }
        if ($Info['newNodeID'] != ''){
            if ($Info['newNodeID'] == "#"){
                $UserStoryInfo['Parent'] = $Info['newNodeID'];
            }
            else{
                $UserStoryInfo['Parent'] = UserStory::findWithId($Info['newNodeID']);
            }
        }
        if ($Info['owner'] != ''){
            if ($Info['owner'] != "No Owner"){
                $UserStoryInfo['Owner'] = Member::FindOwnerByName($Info['project'], $Info['owner']);
            }
        }
        if ($Info['iteration'] != ''){
            $UserStoryInfo['Iteration'] = Iteration::FindIterationName($Info['project'], $Info['iteration']);
        }
        if ($Info['release'] != ''){
            if ($Info['release'] != "No Release"){
                $UserStoryInfo['Release'] = Release::FindReleaseName($Info['project'], $Info['release']);
            }
        }
        $CreatedUserStory = Spark::getInstance()->create('userstory', $UserStoryInfo);
        $UserStoryIcon = "";
        if ($CreatedUserStory['Blocked'] == 1){
            $UserStoryIcon = self::$_BlockedIcons[$CreatedUserStory['ScheduleState']];
            $CreatedUserStory['Blocked'] = true;
        }
        else{
            $UserStoryIcon = self::$_Icons[$CreatedUserStory['ScheduleState']];
            $CreatedUserStory['Blocked'] = false;
        }
        $Result = array('data' => array(
            'ID'        => $CreatedUserStory['_refObjectUUID'],
            'icon'      => $UserStoryIcon,
            'Blocked'   => $CreatedUserStory['Blocked']
        ));
        return $Result;
    }

    public static function DragAndDrop($Info){
        if ($Info->parent == "#"){
            $NewParent = "null";
        }
        else{
            $NewParent = self::findWithId($Info->parent);
        }
        Spark::getInstance()->update('userstory', $Info->node, array('Parent'=>$NewParent));
        // This Line Supposed to be in the Controller instead of here
        $Result = "User Story ID: ".$Info->node." New Parent ID: ".$Info->parent." Parent ?: ".$NewParent;
        return $Result;
    }

    public static function ListAllUserStories($Info){
        $IterationList = array();
        $ProjectName = isset($Info['project'])? $Info['project']: "";
        $ReleaseName = isset($Info['release'])? $Info['release']: "";
        $IterationName = isset($Info['iteration'])? $Info['iteration'] :"";
        $Info['ProjectName'] = isset($Info['project'])? $Info['project']: "";
        if ($ReleaseName == "all" && $IterationName == "all"){
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "((Project.Name = \"{$ProjectName}\") and (parent = \"null\"))", '', 'ScheduleState,c_ArchitecturalTopicID,DirectChildrenCount');
            return self::_FormatRootUserStories($Info['AllUserStories']);
        }
        elseif ($IterationName != "all" && $IterationName != "" && $ReleaseName == ""){
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "(Iteration.Name = \"{$IterationName}\")", '', 'ScheduleState,Iteration,HasParent,Parent,c_ArchitecturalTopicID');
        }
        elseif ($ReleaseName != "all" && $ReleaseName != "" && $IterationName == ""){
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "(Release.Name = \"{$ReleaseName}\")", '', 'ScheduleState,Iteration,HasParent,Parent,c_ArchitecturalTopicID');
        }
        elseif (($ReleaseName != "all" && $ReleaseName != "") && ($IterationName != "all" && $IterationName != "")){
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "((Iteration.Name = \"{$IterationName}\") and (Release.Name = \"{$ReleaseName}\"))", '', 'ScheduleState,Iteration,HasParent,Parent,c_ArchitecturalTopicID');
        }
        elseif (($ReleaseName == "all" && $IterationName== "") || ($ReleaseName == "" && $IterationName== "all")){
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "((Project.Name = \"{$ProjectName}\") and (parent = \"null\"))", '', 'ScheduleState,c_ArchitecturalTopicID,DirectChildrenCount');
            return self::_FormatRootUserStories($Info['AllUserStories']);
        }
        else {
            $IterationName = Iteration::GetCurrentIteration();
            $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "(Iteration.Name = \"{$IterationName}\")", '', 'ScheduleState,Iteration,HasParent,Parent,c_ArchitecturalTopicID');
        }
        for ($i=0; $i<count($Info['AllUserStories']); $i++){
            $Map[] = $Info['AllUserStories'][$i]['_refObjectUUID'];
            $IterationList[$i]['id'] = $Info['AllUserStories'][$i]['_refObjectUUID'];
            $IterationList[$i]['parent'] = $Info['AllUserStories'][$i]['Parent']['_refObjectUUID'];
            $IterationList[$i]['text'] = $Info['AllUserStories'][$i]['_refObjectName'];
            $IterationList[$i]['icon'] = $Info['AllUserStories'][$i]['ScheduleState'];
            $IterationList[$i]['Blocked'] = $Info['AllUserStories'][$i]['Blocked'];
            $IterationList[$i]['TopicID'] = $Info['AllUserStories'][$i]['c_ArchitecturalTopicID'];
            $IterationList[$i]['Iteration'] = $Info['AllUserStories'][$i]['Iteration']['_refObjectName'];
            $IterationList[$i]['has'] = $Info['AllUserStories'][$i]['HasParent'];
        }
        if (isset ($IterationList) && count($IterationList) ==0){
            return "No User stories";
        }
        $Counter = count($IterationList);
        for ($i=0; $i< $Counter; $i++){
            if ($IterationList[$i]['parent'] != "" && $IterationList[$i]['has'] == 1){
                if(!in_array($IterationList[$i]['parent'],$Map)){
                    $Map[] = $IterationList[$i]['parent'];
                    $ShortAllStories = Spark::getInstance()->get('userstory',$IterationList[$i]['parent']);
                    $IterationList[] = array("id"=>$ShortAllStories['_refObjectUUID'],
                                          "parent"=>$ShortAllStories['Parent']['_refObjectUUID'],
                                          "text"=>$ShortAllStories['_refObjectName'],
                                          "icon"=>$ShortAllStories['ScheduleState'],
                                          "Blocked"=>$ShortAllStories['Blocked'],
                                          "TopicID"=>$ShortAllStories['c_ArchitecturalTopicID'],
                                          "Iteration"=>$ShortAllStories['Iteration']['_refObjectName'],
                                          "has"=>$ShortAllStories['HasParent']);
                    $Counter++;
                }
            }
        }
        return self::_FormatIterationUserStories($IterationList);
    }

    public static function ListUserStoriesByIteration($Info){
        $Map = array();
        $IterationName = $Info['iteration'];
        $Release = $Info['release'];
        $IterationList = array();
        $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "(Iteration.Name = \"{$IterationName}\")", '', 'ScheduleState,Iteration,HasParent,Parent,c_ArchitecturalTopicID');
        for ($i=0; $i<count($Info['AllUserStories']); $i++){
            $Map[] = $Info['AllUserStories'][$i]['_refObjectUUID'];
            $IterationList[$i]['id'] = $Info['AllUserStories'][$i]['_refObjectUUID'];
            $IterationList[$i]['parent'] = $Info['AllUserStories'][$i]['Parent']['_refObjectUUID'];
            $IterationList[$i]['text'] = $Info['AllUserStories'][$i]['_refObjectName'];
            $IterationList[$i]['icon'] = $Info['AllUserStories'][$i]['ScheduleState'];
            $IterationList[$i]['Blocked'] = $Info['AllUserStories'][$i]['Blocked'];
            $IterationList[$i]['TopicID'] = $Info['AllUserStories'][$i]['c_ArchitecturalTopicID'];
            $IterationList[$i]['Iteration'] = $Info['AllUserStories'][$i]['Iteration']['_refObjectName'];
            $IterationList[$i]['has'] = $Info['AllUserStories'][$i]['HasParent'];
        }
        if (count($IterationList) ==0){
            return "No User stories";
        }
        $Counter = count($IterationList);
        for ($i=0; $i< $Counter; $i++){
            if ($IterationList[$i]['parent'] != "" && $IterationList[$i]['has'] == 1){
                if(!in_array($IterationList[$i]['parent'],$Map)){
                    $Map[] = $IterationList[$i]['parent'];
                    $ShortAllStories = Spark::getInstance()->get('userstory',$IterationList[$i]['parent']);
                    $IterationList[] = array("id"=>$ShortAllStories['_refObjectUUID'],
                                          "parent"=>$ShortAllStories['Parent']['_refObjectUUID'],
                                          "text"=>$ShortAllStories['_refObjectName'],
                                          "icon"=>$ShortAllStories['ScheduleState'],
                                          "Blocked"=>$ShortAllStories['Blocked'],
                                          "TopicID"=>$ShortAllStories['c_ArchitecturalTopicID'],
                                          "Iteration"=>$ShortAllStories['Iteration']['_refObjectName'],
                                          "has"=>$ShortAllStories['HasParent']);
                    $Counter++;
                }
            }
        }
        return self::_FormatIterationUserStories($IterationList);
    }

    public static function ListRootUserStories($Info){
        $ProjectName = $Info['project'];
        $Info['ProjectName'] = $Info['project'];
        $Info['AllUserStories'] = Spark::getInstance()->find('userstory', "((Project.Name = \"{$ProjectName}\") and (parent = \"null\"))", '', 'ScheduleState,c_ArchitecturalTopicID');
        return self::_FormatRootUserStories($Info['AllUserStories']);
    }

    public static function ListChildrenOfUserStory($UserStoryID){
        $Info['ChildrenUserStories'] = Spark::getInstance()->getChildren('HierarchicalRequirement', "$UserStoryID");
        $Info['CurrentUserStory'] = self::findWithId($UserStoryID);
        return self::_FormatChildrenUserStories($Info);
    }

    private static function _FormatIterationUserStories($Info){
        $FinalArray = array();
        $AllUserStories = $Info;
        for ($i = 0; $i < count($AllUserStories); $i++) {
            $FinalArray[$i] = new \stdClass();
            $FinalArray[$i]->id = $AllUserStories[$i]['id'];
            $FinalArray[$i]->parent = $AllUserStories[$i]['parent'];
            $FinalArray[$i]->text = $AllUserStories[$i]['text'];
            $FinalArray[$i]->icon = $AllUserStories[$i]['icon'];
            $FinalArray[$i]->Blocked = $AllUserStories[$i]['Blocked'];
            $FinalArray[$i]->TopicID = $AllUserStories[$i]['TopicID'];
            $FinalArray[$i]->Iteration = $AllUserStories[$i]['Iteration'];
            $FinalArray[$i]->has = $AllUserStories[$i]['has'];
            if ($FinalArray[$i]->parent == null) {
                $FinalArray[$i]->parent = '#';
            }
            if ($FinalArray[$i]->Blocked == 1) {
                $FinalArray[$i]->icon = self::$_BlockedIcons[$AllUserStories[$i]['icon']];
            } else {
                $FinalArray[$i]->icon = self::$_Icons[$AllUserStories[$i]['icon']];
            }
        }
        return $FinalArray;
    }

    private static function _FormatChildrenUserStories($Info){
        $FinalArray = array();
        $AllUserStories = $Info['ChildrenUserStories'];
        for ($i = 0; $i < count($AllUserStories); $i++) {
            $FinalArray[$i] = new \stdClass();
            $FinalArray[$i]->id = $AllUserStories[$i]['_refObjectUUID'];
            $FinalArray[$i]->parent = $Info['CurrentUserStory']['_refObjectUUID'];
            $FinalArray[$i]->text = $AllUserStories[$i]['_refObjectName'];
            $FinalArray[$i]->icon = $AllUserStories[$i]['ScheduleState'];
            $FinalArray[$i]->Blocked = $AllUserStories[$i]['Blocked'];
            $FinalArray[$i]->TopicID = $AllUserStories[$i]['c_ArchitecturalTopicID'];
            $FinalArray[$i]->Iteration = $AllUserStories[$i]['Iteration']['_refObjectName'];
            $FinalArray[$i]->has = "true";
            if ($FinalArray[$i]->Blocked == 1) {
                $FinalArray[$i]->icon = self::$_BlockedIcons[$AllUserStories[$i]['ScheduleState']];
            } else {
                $FinalArray[$i]->icon = self::$_Icons[$AllUserStories[$i]['ScheduleState']];
            }
        }
        return $FinalArray;
    }

    private static function _FormatRootUserStories($Info){
        $FinalArray = array();
        $AllUserStories = $Info;
        for ($i = 0; $i < count($AllUserStories); $i++) {
            $FinalArray[$i] = new \stdClass();
            $FinalArray[$i]->id = $AllUserStories[$i]['_refObjectUUID'];
            $FinalArray[$i]->text = $AllUserStories[$i]['_refObjectName'];
            $FinalArray[$i]->icon = $AllUserStories[$i]['ScheduleState'];
            $FinalArray[$i]->Blocked = $AllUserStories[$i]['Blocked'];
            $FinalArray[$i]->TopicID = $AllUserStories[$i]['c_ArchitecturalTopicID'];
            $FinalArray[$i]->Iteration = null;
            $FinalArray[$i]->has = false;
            $FinalArray[$i]->ChildrenCount = $AllUserStories[$i]['DirectChildrenCount'];
            $FinalArray[$i]->parent = '#';
            if ($FinalArray[$i]->Blocked == 1) {
                $FinalArray[$i]->icon = self::$_BlockedIcons[$AllUserStories[$i]['ScheduleState']];
            } else {
                $FinalArray[$i]->icon = self::$_Icons[$AllUserStories[$i]['ScheduleState']];
            }
        }
        return $FinalArray;
    }

    private static function _SortByAll($Info){
        $AllUserStories = $Info['AllUserStories'];
        for ($i = 0; $i < count($AllUserStories); $i++) {
            $FinalArrayWithObject[$i] = new \stdClass();
            $FinalArrayWithObject[$i]->id = $AllUserStories[$i]['_refObjectUUID'];
            $FinalArrayWithObject[$i]->parent = $AllUserStories[$i]['Parent']['_refObjectUUID'];
            $FinalArrayWithObject[$i]->text = $AllUserStories[$i]['_refObjectName'];
            $FinalArrayWithObject[$i]->icon = $AllUserStories[$i]['ScheduleState'];
            $FinalArrayWithObject[$i]->Blocked = $AllUserStories[$i]['Blocked'];
            $FinalArrayWithObject[$i]->TopicID = $AllUserStories[$i]['c_ArchitecturalTopicID'];
            $FinalArrayWithObject[$i]->Iteration = $AllUserStories[$i]['Iteration']['_refObjectName'];
            $FinalArrayWithObject[$i]->has = $AllUserStories[$i]['HasParent'];
            if ($FinalArrayWithObject[$i]->parent == null) {
                $FinalArrayWithObject[$i]->parent = '#';
            }
            if ($FinalArrayWithObject[$i]->Blocked == 1) {
                $FinalArrayWithObject[$i]->icon = self::$_BlockedIcons[$AllUserStories[$i]['ScheduleState']];
            } else {
                $FinalArrayWithObject[$i]->icon = self::$_Icons[$AllUserStories[$i]['ScheduleState']];
            }
        }
        return $FinalArrayWithObject;
    }

    private static function _SortByBoth($Info){
        $ReleaseName = $Info['ReleaseName'];
        $Iteration = $Info['IterationName'];
        $AllUserStories = $Info['AllUserStories'];
        $ReleasesArray = array();
        $ShortAllStories = array();
        $Map = array();
        $ReleasesCounter = 0;
        for ($i = 0; $i < count($AllUserStories); $i++){
            if ($AllUserStories[$i]['Release']['_refObjectName'] == $ReleaseName && $AllUserStories[$i]['Iteration']['_refObjectName'] == $Iteration) {
                $Map[] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ReleasesArray[$ReleasesCounter]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ReleasesArray[$ReleasesCounter]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ReleasesArray[$ReleasesCounter]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['has'] = $AllUserStories[$i]['HasParent'];
                $ReleasesCounter++;
            } else {
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['has'] = $AllUserStories[$i]['HasParent'];
                //$ShortAllStoriesCounter++;
            }
        }
        return self::_GenerateArrayWithObj($ShortAllStories, $ReleasesArray, $Map);
    }

    private static function _SortByRelease($Info){
        $ReleaseName = $Info['ReleaseName'];
        $AllUserStories = $Info['AllUserStories'];
        $ReleasesArray = array();
        $ShortAllStories = array();
        $Map = array();
        $ReleasesCounter = 0;
        for ($i = 0; $i < count($AllUserStories); $i++){
            if ($AllUserStories[$i]['Release']['_refObjectName'] == $ReleaseName) {
                $Map[] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ReleasesArray[$ReleasesCounter]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ReleasesArray[$ReleasesCounter]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ReleasesArray[$ReleasesCounter]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['has'] = $AllUserStories[$i]['HasParent'];
                $ReleasesCounter++;
            } else {
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['has'] = $AllUserStories[$i]['HasParent'];
            }
        }
        return self::_GenerateArrayWithObj($ShortAllStories, $ReleasesArray, $Map);
    }

    private static function _SortByIteration($Info){
        $Iteration = $Info['IterationName'];
        $AllUserStories = $Info['AllUserStories'];
        $ReleasesArray = array();
        $ShortAllStories = array();
        $Map = array();
        $ReleasesCounter = 0;
        for ($i = 0; $i < count($AllUserStories); $i++){
            if ($AllUserStories[$i]['Iteration']['_refObjectName'] == $Iteration) {
                $Map[] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ReleasesArray[$ReleasesCounter]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ReleasesArray[$ReleasesCounter]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ReleasesArray[$ReleasesCounter]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ReleasesArray[$ReleasesCounter]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ReleasesArray[$ReleasesCounter]['has'] = $AllUserStories[$i]['HasParent'];
                $ReleasesCounter++;
            } else {
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['id'] = $AllUserStories[$i]['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['parent'] = $AllUserStories[$i]['Parent']['_refObjectUUID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['text'] = $AllUserStories[$i]['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['icon'] = $AllUserStories[$i]['ScheduleState'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Blocked'] = $AllUserStories[$i]['Blocked'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['TopicID'] = $AllUserStories[$i]['c_ArchitecturalTopicID'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['Iteration'] = $AllUserStories[$i]['Iteration']['_refObjectName'];
                $ShortAllStories[$AllUserStories[$i]['_refObjectUUID']]['has'] = $AllUserStories[$i]['HasParent'];
            }
        }
        return self::_GenerateArrayWithObj($ShortAllStories, $ReleasesArray, $Map);
    }

    private static function _GenerateArrayWithObj($ShortAllStories,$ReleasesArray, $Map){
        $FinalArray = $ReleasesArray;
        $FinalArrayWithObject = array();
        $Counter = count($FinalArray);
        for ($i = 0; $i < $Counter; $i++) {
            if ($FinalArray[$i]['parent'] != "" && $FinalArray[$i]['has'] == 1) {
                if (!in_array($FinalArray[$i]['parent'], $Map)) {
                    $Map[] = $FinalArray[$i]['parent'];
                    $FinalArray[] = array("id" => $ShortAllStories[$FinalArray[$i]['parent']]['id'],
                        "parent" => $ShortAllStories[$FinalArray[$i]['parent']]['parent'],
                        "text" => $ShortAllStories[$FinalArray[$i]['parent']]['text'],
                        "icon" => $ShortAllStories[$FinalArray[$i]['parent']]['icon'],
                        "Blocked" => $ShortAllStories[$FinalArray[$i]['parent']]['Blocked'],
                        "TopicID" => $ShortAllStories[$FinalArray[$i]['parent']]['TopicID'],
                        "Iteration" => $ShortAllStories[$FinalArray[$i]['parent']]['Iteration'],
                        "has" => $ShortAllStories[$FinalArray[$i]['parent']]['has']);
                    $Counter++;
                }
                $FinalArrayWithObject[$i] = new \stdClass();
                $FinalArrayWithObject[$i]->id = $FinalArray[$i]['id'];
                $FinalArrayWithObject[$i]->parent = $FinalArray[$i]['parent'];
                $FinalArrayWithObject[$i]->text = $FinalArray[$i]['text'];
                $FinalArrayWithObject[$i]->icon = $FinalArray[$i]['icon'];
                $FinalArrayWithObject[$i]->Blocked = $FinalArray[$i]['Blocked'];
                $FinalArrayWithObject[$i]->TopicID = $FinalArray[$i]['TopicID'];
                $FinalArrayWithObject[$i]->Iteration = $FinalArray[$i]['Iteration'];
                $FinalArrayWithObject[$i]->has = $FinalArray[$i]['has'];
                if ($FinalArrayWithObject[$i]->parent == null) {
                    $FinalArrayWithObject[$i]->parent = '#';
                }
                if ($FinalArrayWithObject[$i]->Blocked == 1) {
                    $FinalArrayWithObject[$i]->icon = self::$_BlockedIcons[$FinalArray[$i]['icon']];
                } else {
                    $FinalArrayWithObject[$i]->icon = self::$_Icons[$FinalArray[$i]['icon']];
                }
            } else {
                $FinalArrayWithObject[$i] = new \stdClass();
                $FinalArrayWithObject[$i]->id = $FinalArray[$i]['id'];
                $FinalArrayWithObject[$i]->parent = $FinalArray[$i]['parent'];
                $FinalArrayWithObject[$i]->text = $FinalArray[$i]['text'];
                $FinalArrayWithObject[$i]->icon = $FinalArray[$i]['icon'];
                $FinalArrayWithObject[$i]->Blocked = $FinalArray[$i]['Blocked'];
                $FinalArrayWithObject[$i]->TopicID = $FinalArray[$i]['TopicID'];
                $FinalArrayWithObject[$i]->Iteration = $FinalArray[$i]['Iteration'];
                $FinalArrayWithObject[$i]->has = $FinalArray[$i]['has'];
                if ($FinalArrayWithObject[$i]->parent == null) {
                    $FinalArrayWithObject[$i]->parent = '#';
                }
                if ($FinalArrayWithObject[$i]->Blocked == 1) {
                    $FinalArrayWithObject[$i]->icon = self::$_BlockedIcons[$FinalArray[$i]['icon']];
                } else {
                    $FinalArrayWithObject[$i]->icon = self::$_Icons[$FinalArray[$i]['icon']];
                }
            }
        }
        return $FinalArrayWithObject;
    }

    private static function _SortUserStories($Info){
        $ProjectName = $Info['ProjectName'];
        $ReleaseName = $Info['ReleaseName'];
        $Iteration = $Info['IterationName'];
        $AllUserStories = $Info['AllUserStories'];
        if ($AllUserStories == 0){
            $Result = "No User stories";
            return $Result;
        }
        if (($ReleaseName == "All" && $Iteration == null) || ($ReleaseName == "All" && $Iteration == "All")){
            $Result = self::_SortByAll($Info);
            return $Result;
        }
        elseif ($ReleaseName != null && $Iteration != null && $ReleaseName != "All" && $Iteration != "All"){
            $Result = self::_SortByBoth($Info);
            return $Result;
        }
        elseif (($ReleaseName != null && $Iteration == null) || ($ReleaseName != null && $Iteration == "All")){
            $Result = self::_SortByRelease($Info);
            return $Result;
        }
        elseif (($Iteration != null && $ReleaseName == null) || ($Iteration != null && $ReleaseName == "All")){
            $Result = self::_SortByIteration($Info);
            return $Result;
        }
    }

}
