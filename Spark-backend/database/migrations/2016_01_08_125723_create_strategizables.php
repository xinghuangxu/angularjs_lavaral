<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStrategizables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('strategizables', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('StrategyID');
            $table->string('strategizable_id');
            $table->string('strategizable_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('strategizables');
    }
}
