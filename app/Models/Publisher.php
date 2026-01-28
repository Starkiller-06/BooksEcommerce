<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    protected $fillable = ['publisher'];
    /** @use HasFactory<\Database\Factories\PublisherFactory> */
    use HasFactory;
}
