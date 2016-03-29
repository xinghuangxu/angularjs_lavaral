<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddScopeToStrategyInstances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('test_plan_test_strategies', function (Blueprint $table) {
            $table->string('updated_by')->nullable();
            $table->string('priority')->nullable();
            $table->float('scope')->nullable();
            $table->float('risk')->nullable();
            $table->string('leverage')->nullable();
            // Reducing the amount of scoping metadata fields
            //$table->string('complexity');
            //$table->text('comment');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('test_plan_test_strategies', function (Blueprint $table) {
            $table->dropColumn([
                'updated_by',
                'priority',
                'scope',
                'risk',
                'leverage'
            ]);
        });
    }
}
