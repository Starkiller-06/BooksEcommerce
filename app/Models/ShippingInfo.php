<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingInfo extends Model
{
    use HasFactory;

    protected $table = 'shipping_info'; 

    protected $fillable = [
        'user_id', 
        'recipient_name', 
        'address', 
        'city', 
        'state', 
        'zip_code', 
        'phone_number'
    ];
}