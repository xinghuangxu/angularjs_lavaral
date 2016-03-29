<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\ALM;

use \Config;

class Database {
    public static function getDetails($db, $isAlm = false) {
        $connections = Config::get('database.connections');

        if($isAlm)
            $db = "alm_$db";

        if(isset($connections[$db])) {
            return array (
                    'name' => $connections[$db]['database'],
                    'description' => $connections[$db]['description'],
            );
        }

        return null;
    }

    public static function getAllDatabases() {
        $connections = Config::get('database.connections');

        $almDatabases = [];
        foreach($connections as $name => $connection) {
            if(!preg_match("/^alm_/", $name))
                continue;

            $db = self::getDetails($name);
            if($db)
                $almDatabases[] = $db;
        }

        //return (env('APP_ENV') == 'local') ? ['tattdb_mark_test'] : $almDatabases;
        return $almDatabases;
    }
}
