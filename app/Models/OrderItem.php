<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 
        'bcopy_id', 
        'quantity', 
        'price_each'
    ];

    public function copy()
    {
        return $this->belongsTo(BookCopy::class, 'bcopy_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}