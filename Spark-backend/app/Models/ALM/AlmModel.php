<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models\ALM;

use Spark\Models\Model;
use Log;
use InvalidArgumentException;

class AlmModel extends Model {
    public $timestamps = false;

    /**
     * Get an instance of a model connected to a particular ALM database
     *
     * @throws \Spark\ALM\InvalidAlmDatabaseException
     */
    public static function from($database)
    {
        try {
            return self::on( 'alm_' . $database );
        }
        catch (InvalidArgumentException $e) {
            throw new InvalidAlmDatabaseException("No connection info defined for ALM Database '$database'");
        }
    }
}

