<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingInfo extends Model
{
    use HasFactory;

    protected $table = 'billing_info';

    protected $fillable = [
        'user_id', 
        'payment_method', 
        'payment_type', 
        'card_last4', 
        'expiry_date'
    ];
}