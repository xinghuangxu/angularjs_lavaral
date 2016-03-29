<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Spark\Models\Planner\TestPlanStack;
use Spark\Models\Planner\TestPlanSubStack;

class UpdateSeedTestplanSubstacks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        TestPlanSubStack::where('name','=','Unit Test')->delete();
        TestPlanSubStack::where('name','=','Module Test')->delete();
        TestPlanSubStack::where('name','=','Boxcar Performance and Benchmarking')->delete();
        TestPlanSubStack::where('name','=','Boxcar QA')->delete();
        $id = TestPlanStack::where('name','like','Boxcar')->get(['id'])->toArray()[0]['id'];
        $substacks[] = ['name'=>'Unit Test','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>1];
	    $substacks[] = ['name'=>'Module Test','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>2];
	    $substacks[] = ['name'=>'Boxcar Performance and Benchmarking','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>3];
	    $substacks[] = ['name'=>'Boxcar QA','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>4];

        foreach($substacks as $sub) {
            $temp = TestPlanSubStack::create($sub);
            $temp->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        TestPlanSubStack::where('name','=','Unit Test')->delete();
        TestPlanSubStack::where('name','=','Module Test')->delete();
        TestPlanSubStack::where('name','=','Boxcar Performance and Benchmarking')->delete();
        TestPlanSubStack::where('name','=','Boxcar QA')->delete();
        $id = 'LSIP';  //Magic number: use just the CQ prefix to represent all Boxcars
        $substacks[] = ['name'=>'Unit Test','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>1];
	    $substacks[] = ['name'=>'Module Test','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>2];
	    $substacks[] = ['name'=>'Boxcar Performance and Benchmarking','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>3];
	    $substacks[] = ['name'=>'Boxcar QA','stack_id'=>$id,'created_by'=>'mohamman','display_order'=>4];

        foreach($substacks as $sub) {
            $temp = TestPlanSubStack::create($sub);
            $temp->save();
        }
    }
}
