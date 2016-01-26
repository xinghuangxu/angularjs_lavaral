<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RecreateTestplansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Drop [testplans] table
        Schema::drop('testplans');

        //Recreate [testplans] table
        Schema::create('testplans', function (Blueprint $table) {
            $table->increments('id');
            $table->string('release_id', 20);
            $table->string('testplan_stack_id', 50)->nullable();
            $table->integer('testplan_substack_id')->nullable();
            $table->string('testplan_boxcar_id', 13)->nullable();
            $table->string('alm_db_name', 50)->nullable();
            $table->integer('alm_folder_node_id')->nullable();
            $table->string('alm_testset_prefix', 200)->nullable();
            $table->dateTime('project_start_date')->nullable();
            $table->dateTime('project_completion_date')->nullable();
            $table->string('created_by', 100)->nullable();
            $table->string('updated_by', 100)->nullable();
            $table->integer('rally_project_id')->nullable();
            $table->string('rally_release_id', 50)->nullable();
            $table->string('wiki_url', 500)->nullable();
            $table->timestamps();
        });

        //Create unique key index
        Schema::table('testplans', function (Blueprint $table) {
           $table->unique(array('release_id', 'testplan_stack_id', 'testplan_substack_id', 'testplan_boxcar_id'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //Drop [testplans] table
        Schema::drop('testplans');

        //Recreate [testplans] table
        Schema::create('testplans', function (Blueprint $table) {
            $table->increments('id');
            $table->string('release_id', 20);
            $table->string('testplan_stack_id', 50);
            $table->integer('testplan_substack_id')->default(0);
            $table->string('testplan_boxcar_id', 13)->nullable();
            $table->string('alm_db_name', 50)->nullable();
            $table->integer('alm_folder_node_id')->nullable();
            $table->string('alm_testset_prefix', 200)->nullable();
            $table->dateTime('project_start_date')->nullable();
            $table->dateTime('project_completion_date')->nullable();
            $table->string('created_by', 100)->nullable();
            $table->string('updated_by', 100)->nullable();
            $table->integer('rally_project_id')->nullable();
            $table->string('rally_release_id', 50)->nullable();
            $table->string('wiki_url', 500)->nullable();
            $table->timestamps();
        });

        //Create unique key index
        Schema::table('testplans', function (Blueprint $table) {
           $table->unique(array('release_id', 'testplan_stack_id', 'testplan_substack_id'));
        });
    }
}
