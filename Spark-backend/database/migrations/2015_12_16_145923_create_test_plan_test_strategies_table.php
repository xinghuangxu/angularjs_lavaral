<?php
/**
 * @author ng-epg-qa-spark-developers
 * @modifier Mark Padding
 * @copyright 2016 NetApp, Inc.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestPlanTestStrategiesTable extends Migration {

    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        Schema::create('test_plan_test_strategies', function(Blueprint $table)
        {
            $table->increments('id');
            $table->timestamps();
            $table->string ( 'created_by', 50 );
            $table->integer ( 'testplan_id' );
            $table->integer ( 'StrategyID' );
        });
    }

    /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down()
    {
        Schema::drop('test_plan_test_strategies');
    }

}
