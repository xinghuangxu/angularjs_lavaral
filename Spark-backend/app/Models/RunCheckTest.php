<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-21
 */

namespace Spark\Models;

use Spark\Models\Model;

class RunCheckTest extends Model {
    public $timestamps = false;
    protected $table = 'runcheck_tests';
    public $primaryKey = 'test_id';


}
