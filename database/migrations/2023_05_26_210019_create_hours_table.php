<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hours', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->datetime('act_date');
            $table->datetime('beg_time');
            $table->datetime('end_time')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->boolean('billable')->default(false);
            $table->bigInteger('duration')->nullable();
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
        Schema::dropIfExists('hours');
    }
}
