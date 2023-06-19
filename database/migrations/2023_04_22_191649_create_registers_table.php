<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id');
            $table->bigInteger('entry_id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('income')->default(false);
            $table->bigInteger('category_id')->nullable();
            $table->bigInteger('account_id')->nullable();
            $table->bigInteger('party_id')->nullable();
            $table->decimal('amount');
            $table->datetime('paid_date');
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
        Schema::dropIfExists('registers');
    }
}
