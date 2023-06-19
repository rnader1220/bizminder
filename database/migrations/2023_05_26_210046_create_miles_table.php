<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('miles', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->datetime('travel_date')->nullable();
            $table->datetime('travel_time')->nullable();
            $table->decimal('beg_odometer');
            $table->decimal('end_odometer')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->boolean('billable')->default(false);
            $table->boolean('reportable')->default(false);
            $table->decimal('distance')->nullable();
            $table->bigInteger('category_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('miles');
    }
}
