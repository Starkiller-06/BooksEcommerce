<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookCopy extends Model
{
    protected $fillable = [
        'book_id', 
        'publisher_id', 
        'isbn', 
        'quantity', 
        'unit_price', 
        'format', 
        'edition',
        'description'
    ];

    public function book() {
        return $this->belongsTo(Book::class);
    }
    
    public function media() {
        return $this->hasOne(Media::class, 'bcopy_id');
    }
}