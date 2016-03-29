<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFieldHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('field_history', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('created_at');
            $table->string('user', 20);
            $table->string('type', 100);
            $table->string('field', 200);
            $table->text('oldval');
            $table->text('newval');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('field_history');
    }
}
