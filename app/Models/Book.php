<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title', 'synopsis', 'publish_year'];

    public function genres() {
        return $this->belongsToMany(Genre::class, 'book_genres');
    }

    public function authors() {
        return $this->belongsToMany(Author::class, 'book_authors');
    }

    public function copies() {
        return $this->hasMany(BookCopy::class);
    }
}