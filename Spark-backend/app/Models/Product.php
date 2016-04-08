<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2016 NetApp, Inc.
 * @date 2016-03-21
 */

namespace Spark\Models;

use Spark\Models\Model;

class Product extends Model {
    public $timestamps = false;
    protected $table = 'products';
    public $primaryKey = 'product_id';


}
