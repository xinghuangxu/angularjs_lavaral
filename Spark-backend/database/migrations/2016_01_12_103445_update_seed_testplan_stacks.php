<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Spark\Models\Planner\TestPlanStack;

class UpdateSeedTestplanStacks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $stack = TestPlanStack::create(['name'=>'Boxcar', 'created_by'=>'mpadding', 'display_order'=>14]);
        $stack->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        TestPlanStack::where('name','=','Boxcar')->delete();
    }
}
