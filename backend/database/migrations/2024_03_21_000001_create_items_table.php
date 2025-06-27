<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image_url');
            $table->foreignId('creator_id')->constrained('users');
            $table->foreignId('current_owner_id')->constrained('users');
            $table->unsignedBigInteger('price');
            $table->boolean('is_listed')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('items');
    }
};
