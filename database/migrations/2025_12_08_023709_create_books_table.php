<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn', 15)->unique();
            $table->string('title', 100);
            
            $table->foreignId('genre_id')->constrained('genres')->onDelete('restrict');
            $table->foreignId('publisher_id')->constrained('publishers')->onDelete('restrict');
            
            $table->text('description')->nullable();
            $table->year('publish_year');
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
