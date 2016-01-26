<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2015 NetApp, Inc.
 */

namespace Spark\Models;

use Illuminate\Database\Eloquent\Model as EloquentModel;
use \DB;
use \Auth;
use \Session;
use Carbon\Carbon;

class Model extends EloquentModel {
    public $timestamps = false;

    public function saveWithHistory($options = array()) {
        DB::transaction($bool = function($options) use ($options) {
            $this->logFieldHistory();
            return $this->save($options);
        });
        return $bool;
    }

    protected function logFieldHistory() {
        //Get user and date info
        $currentUser = Auth::user()->username;
        $currentDate = Carbon::now();

        //Collect old values, new values, and object information
        $newValues = $this->toArray();
        $objType = get_class($this);
        $id_key = $this->primaryKey ? $this->primaryKey : 'id';
        $oldObj = $objType::find($newValues[$id_key]);
        $oldValues = $oldObj->toArray();

        //Remove fields that do not require history tracking
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);
        unset($oldValues['updated_by']);
        unset($newValues['updated_by']);
        if (isset($this->excludeHistoryArray)) {
            foreach($this->excludeHistoryArray as $index) {
                unset($oldValues[$index]);
                unset($newValues[$index]);
            }
        }

        //Log the changes in the field_history table
        $inOriginal = array_diff_assoc($oldValues, $newValues);
        foreach($inOriginal as $key => $value) {
            $record = array('created_at' => $currentDate,
                'user' => $currentUser,
                'type' => $objType,
                'field' => $key,
                'oldval' => !is_null($value) ? $value : 'null',
                'newval' => !is_null($newValues[$key]) ? $newValues[$key] : 'null'
            );
            DB::table('field_history')->insert($record);
        }
    }
}
