<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $sessionCart = session()->get('cart', []);

        $items = [];

        if (!empty($sessionCart)) {
            $bookCopies = BookCopy::with(['book.authors', 'media'])
                ->whereIn('id', array_keys($sessionCart))
                ->get();

            $items = $bookCopies->map(function ($copy) use ($sessionCart) {
                return [
                    'cart_item_id' => $copy->id, 
                    'id'           => $copy->book->id,
                    'title'        => $copy->book->title,
                    'author'       => $copy->book->authors->pluck('name')->join(', '),
                    'format'       => ucfirst($copy->format),
                    'price'        => (float) $copy->unit_price,
                    'quantity'     => $sessionCart[$copy->id], 
                    'image'        => $copy->media 
                        ? '/storage/' . $copy->media->img_path 
                        : 'https://placehold.co/400x600?text=No+Cover',
                ];
            })->values();
        }

        return Inertia::render('cart', [
            'cartItems' => $items 
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'format'  => 'required|string'
        ]);

        $copy = BookCopy::where('book_id', $request->book_id)
            ->where('format', strtolower($request->format))
            ->first();

        if (!$copy) {
            return back()->withErrors(['error' => 'Format unavailable']);
        }

        $cart = session()->get('cart', []);

        if (isset($cart[$copy->id])) {
            $cart[$copy->id]++;
        } else {
            $cart[$copy->id] = 1;
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', 'Added to cart');
    }

    public function remove($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            session()->put('cart', $cart);
        }

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id] = $request->quantity;
            session()->put('cart', $cart);
        }

        return redirect()->back();
    }
}