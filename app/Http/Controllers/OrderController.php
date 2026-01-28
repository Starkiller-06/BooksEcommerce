<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingInfo;
use App\Models\BillingInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create()
    {
        $sessionCart = session()->get('cart', []);
        
        if (empty($sessionCart)) {
            return redirect()->route('shop.index');
        }

        $dbItems = BookCopy::with(['book.authors', 'media'])
            ->whereIn('id', array_keys($sessionCart))
            ->get();

        if ($dbItems->isEmpty()) {
            session()->forget('cart');
            return redirect()->route('shop.index')->with('error', 'Cart items are no longer available.');
        }

        $cartItems = $dbItems->map(function ($copy) use ($sessionCart) {
                $mediaItem = $copy->media; 
                
                if ($mediaItem instanceof \Illuminate\Database\Eloquent\Collection) {
                    $mediaItem = $mediaItem->first();
                }

                $imagePath = ($mediaItem && $mediaItem->img_path) 
                    ? '/storage/' . $mediaItem->img_path 
                    : 'https://placehold.co/400x600?text=No+Cover';

                return [    
                    'id' => $copy->id,
                    'title' => $copy->book->title ?? 'Unknown Title',
                    'description' => ucfirst($copy->format),
                    'price' => (float) $copy->unit_price, 
                    'quantity' => (int) ($sessionCart[$copy->id] ?? 1),
                    'image' => $imagePath,
                ];
            })->values();

        return Inertia::render('checkout', [ 
            'cartItems' => $cartItems, 
            'paymentMethods' => [
                ['id' => 'credit_card', 'label' => 'Credit Card'],
                ['id' => 'paypal', 'label' => 'PayPal']
            ],
            'cardTypes' => [
                ['id' => 'visa', 'label' => 'Visa'],
                ['id' => 'mastercard', 'label' => 'MasterCard'],
                ['id' => 'american_express', 'label' => 'American Express'],
                ['id' => 'jcb', 'label' => 'JCB'],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string|max:60',
            'address' => 'required|string|max:100',
            'city' => 'required|string|max:50',
            'state' => 'required|string|max:20',
            'zip_code' => 'required|string|max:50',
            'phone_number' => 'required|string|max:50',
            'payment_method' => 'required|in:credit_card,paypal',
            'payment_type' => 'nullable|string',
            'card_last4' => 'nullable|string|size:4',
            'expiry_date' => 'nullable|string',
        ]);

        $sessionCart = session()->get('cart', []);
        if (empty($sessionCart)) return redirect()->route('shop.index');

        try {
            DB::beginTransaction();

            $shipping = ShippingInfo::create([
                'user_id' => Auth::id(),
                'recipient_name' => $request->recipient_name,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
                'phone_number' => $request->phone_number,
            ]);

            $billing = BillingInfo::create([
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
                'payment_type' => $request->payment_type,
                'card_last4' => $request->card_last4,
                'expiry_date' => $request->expiry_date,
            ]);

            $totalAmount = 0;
            $bookCopies = BookCopy::whereIn('id', array_keys($sessionCart))->get();
            foreach ($bookCopies as $copy) {
                $qty = $sessionCart[$copy->id];
                $totalAmount += $copy->unit_price * $qty;
            }
            $totalAmount += 5.00; 

            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'billing_id' => $billing->id,
                'shipping_id' => $shipping->id,
            ]);

            foreach ($bookCopies as $copy) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'bcopy_id' => $copy->id,
                    'quantity' => $sessionCart[$copy->id],
                    'price_each' => $copy->unit_price,
                ]);
            }

            DB::commit();

            return redirect()->route('home')->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Order failed: ' . $e->getMessage()]);
        }
    }
}