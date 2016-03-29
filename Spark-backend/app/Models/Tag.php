<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Maneesh Abraham
 * @copyright 2015 NetApp, Inc.
 * @date 2016-01-04
 */

namespace Spark\Models;

use Spark\Models\Model;

class Tag extends Model {
    public $timestamps = false;
    protected $table = 'Categories';
    public $primaryKey = 'CategoryID';
    protected $hidden = array('IsPRCategory', 'IsStrategyCategory', 'Description', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate', 'ApprovedBy', 'ApprovedDate', 'Component', 'Feature', 'Software', 'Hardware', 'ALM', 'QualificationArea');

    /**
     * Note: Tag model points to the [Categories] table
     */

}