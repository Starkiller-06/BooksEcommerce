<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'shipping'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->shipping->recipient_name ?? $order->user->name ?? 'Guest',
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'date' => $order->created_at->format('M d, Y'),
                    'items_count' => $order->items->count(),
                ];
            });

        return Inertia::render('orders', [
            'orders' => $orders
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['shipping', 'billing', 'items.copy.book', 'items.copy.media'])->findOrFail($id);

        return Inertia::render('orderDetails', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at->format('F j, Y, g:i a'),
                'shipping' => $order->shipping,
                'billing' => $order->billing,
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->copy->book->title,
                    'format' => ucfirst($item->copy->format),
                    'quantity' => $item->quantity,
                    'price' => $item->price_each,
                    'image' => $item->copy->media ? '/storage/' . $item->copy->media->img_path : null
                ]),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}