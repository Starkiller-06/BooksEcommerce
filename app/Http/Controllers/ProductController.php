<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function home()
    {
        $newArrivals = Book::with(['authors', 'genres', 'copies.media'])
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($book) {
                return $this->formatBookForFrontend($book);
            });

        $featured = Book::with(['authors', 'genres', 'copies.media'])
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($book) {
                return $this->formatBookForFrontend($book);
            });

        return Inertia::render('home', [
            'newArrivals' => $newArrivals,
            'featured' => $featured
        ]);
    }

    public function show($id)
    {
        $book = Book::with(['authors', 'genres', 'copies.media'])->findOrFail($id);
        $mainCopy = $book->copies->first();

        $productDetails = [
            'id' => $book->id,
            'title' => $book->title,
            'synopsis' => $book->synopsis ?? 'No synopsis available.',
            'publish_year' => $book->publish_year,           
            'author' => $book->authors->pluck('name')->join(', '), 
            'genres' => $book->genres->pluck('genre')->toArray(),
            'price' => $mainCopy ? (float) $mainCopy->unit_price : 0,
            'isbn' => $mainCopy ? $mainCopy->isbn : 'N/A',
            'format' => $mainCopy ? ucfirst($mainCopy->format) : 'N/A',
            'stock' => $book->copies->sum('quantity'),
            'image' => ($mainCopy && $mainCopy->media) 
                ? '/storage/' . $mainCopy->media->img_path 
                : 'https://placehold.co/600x900?text=No+Cover',
            'available_formats' => $book->copies->map(fn($c) => [
                'id' => $c->id,
                'format' => ucfirst($c->format),
                'price' => $c->unit_price
            ])
        ];

        return Inertia::render('bookDetails', [
            'product' => $productDetails
        ]);
    }

    public function index(Request $request)
    {
        $query = Book::with(['genres', 'authors', 'copies.media']);

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('authors', function ($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        if ($request->genre) {
            $query->whereHas('genres', function ($q) use ($request) {
                $q->where('genre', $request->genre);
            });
        }

        if ($request->availability === 'instock') {
            $query->whereHas('copies', function ($q) {
                $q->where('quantity', '>', 0);
            });
        }

        $books = $query->paginate(12)
            ->withQueryString()
            ->through(fn ($book) => $this->formatBookForFrontend($book));

        return Inertia::render('catalog', [
            'products' => $books,
            'filters' => $request->only(['search', 'sort', 'availability', 'genre']),
        ]);
    }

    private function formatBookForFrontend($book)
    {
        $mainCopy = $book->copies->first();

        return [
            'id' => $book->id,
            'title' => $book->title,
            'authors' => $book->authors->map(fn($a) => ['name' => $a->name]),   
            'copies' => [
                [
                    'id' => $mainCopy ? $mainCopy->id : null,
                    'unit_price' => $mainCopy ? (float) $mainCopy->unit_price : 0,
                    'media' => [
                        'img_path' => ($mainCopy && $mainCopy->media) 
                            ? '/storage/' . $mainCopy->media->img_path 
                            : 'https://placehold.co/400x600?text=No+Cover'
                    ]
                ]
            ]
        ];
    }
}