<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Genre;
use App\Models\Media;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; 
use Inertia\Inertia;
use App\Rules\IsValidIsbn;

class BookController extends Controller
{
    public function index()
    {
        $query = Book::query()->with(['genres', 'authors', 'copies']);
        $copies = $query->latest()->get();

        return Inertia::render('products', [
            'copies' => $copies
        ]);
    }

    public function create()
    {
        return Inertia::render('create', [
            'authors' => Author::orderBy('name')->select('id', 'name')->get(),
            'genres' => Genre::orderBy('genre')->get(),
            'publishers' => Publisher::orderBy('publisher')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'synopsis' => 'nullable|string',
            'publish_year' => 'required|integer|digits:4',
            'isbn' => 'required|string|max:13|unique:book_copies,isbn',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'format' => 'required|in:hardcover,paperback',
            'edition' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'publisher_id' => 'nullable|exists:publishers,id',
            'new_publisher_name' => 'nullable|string|required_without:publisher_id',
            'genre_ids' => 'array', 
            'genre_ids.*' => 'exists:genres,id', 
            'new_genres' => 'nullable|array',
            'new_genres.*' => 'string', 
            'author_ids' => 'array',
            'author_ids.*' => 'exists:authors,id',
            'new_authors' => 'array', 
            'new_authors.*.name' => 'required_with:new_authors|string',
            'cover_url' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        try {
            DB::beginTransaction();

            if ($request->filled('new_publisher_name')) {
                $publisher = Publisher::firstOrCreate(['publisher' => $request->new_publisher_name]);
                $publisherId = $publisher->id;
            } else {
                $publisherId = $request->publisher_id;
            }

            $book = Book::create([
                'title' => $request->title,
                'synopsis' => $request->synopsis,
                'publish_year' => $request->publish_year,
            ]);

            $allGenreIds = $request->genre_ids ?? [];
            if ($request->filled('new_genres')) {
                foreach ($request->new_genres as $genreName) {
                    $genre = Genre::firstOrCreate(['genre' => $genreName]);
                    $allGenreIds[] = $genre->id;
                }
            }
            $book->genres()->sync($allGenreIds);

            $allAuthorIds = $request->author_ids ?? [];
            if ($request->filled('new_authors')) {
                foreach ($request->new_authors as $authorData) {
                    $author = Author::create(['name' => $authorData['name']]);
                    $allAuthorIds[] = $author->id;
                }
            }
            $book->authors()->sync($allAuthorIds);

            $bookCopy = BookCopy::create([
                'book_id' => $book->id,
                'publisher_id' => $publisherId,
                'isbn' => $request->isbn,
                'quantity' => $request->quantity,
                'unit_price' => $request->unit_price,
                'format' => $request->format,
                'description' => $request->description, 
                'edition' => $request->edition,
            ]);

            if ($request->hasFile('cover_url')) {
                $path = $request->file('cover_url')->store('covers', 'public');
                
                Media::create([
                    'bcopy_id' => $bookCopy->id,
                    'img_path' => $path
                ]);
            }

            DB::commit();
            return redirect()->route('admin.dashboard')->with('success', 'Book created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $book = Book::with(['authors', 'genres', 'copies.media'])->findOrFail($id);
        $mainCopy = $book->copies->first();

        return Inertia::render('create', [
            'isEditing' => true,
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'synopsis' => $book->synopsis,
                'publish_year' => $book->publish_year,
                'genre_ids' => $book->genres->pluck('id')->map(fn($id) => (string)$id),
                'author_ids' => $book->authors->pluck('id')->map(fn($id) => (string)$id),
                'isbn' => $mainCopy?->isbn ?? '',
                'unit_price' => $mainCopy?->unit_price ?? '',
                'quantity' => $mainCopy?->quantity ?? 0,
                'format' => $mainCopy?->format ?? '',
                'edition' => $mainCopy?->edition ?? '',
                'description' => $mainCopy?->description ?? '',
                'publisher_id' => $mainCopy?->publisher_id ? (string)$mainCopy->publisher_id : '',
                'cover_url' => $mainCopy?->media?->img_path ?? '', // Send existing path string
                'new_publisher_name' => '',
                'new_genres' => [],
                'new_authors' => [],
            ],
            'authors' => Author::orderBy('name')->select('id', 'name')->get(),
            'genres' => Genre::orderBy('genre')->get(),
            'publishers' => Publisher::orderBy('publisher')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::with('copies.media')->findOrFail($id);
        $mainCopy = $book->copies->first(); 

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'synopsis' => 'nullable|string',
            'publish_year' => 'required|integer|digits:4',
            'isbn' => [
                'required', 
                'string', 
                'unique:book_copies,isbn,' . ($mainCopy ? $mainCopy->id : 'NULL'), 
                new IsValidIsbn() 
            ],
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'format' => 'required|in:hardcover,paperback',
            'edition' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'publisher_id' => 'nullable|exists:publishers,id',
            'new_publisher_name' => 'nullable|string|required_without:publisher_id',
            'genre_ids' => 'array',
            'author_ids' => 'array',
            'new_genres' => 'nullable|array',
            'new_authors' => 'nullable|array',
            'cover_url' => 'nullable' 
        ]);

        try {
            DB::beginTransaction();

            $book->update([
                'title' => $request->title,
                'synopsis' => $request->synopsis,
                'publish_year' => $request->publish_year,
            ]);
            $allGenreIds = $request->genre_ids ?? [];
            if ($request->filled('new_genres')) {
                foreach ($request->new_genres as $genreName) {
                    $genre = Genre::firstOrCreate(['genre' => $genreName]);
                    $allGenreIds[] = $genre->id;
                }
            }
            $book->genres()->sync($allGenreIds);
        
            $allAuthorIds = $request->author_ids ?? [];
            if ($request->filled('new_authors')) {
                foreach ($request->new_authors as $authorData) {
                    $author = Author::firstOrCreate(['name' => $authorData['name']]);
                    $allAuthorIds[] = $author->id;
                }
            }
            $book->authors()->sync($allAuthorIds);
            $publisherId = $request->publisher_id;
            if ($request->filled('new_publisher_name')) {
                $pub = Publisher::firstOrCreate(['publisher' => $request->new_publisher_name]);
                $publisherId = $pub->id;
            }

            if ($mainCopy) {
                $mainCopy->update([
                    'publisher_id' => $publisherId,
                    'isbn' => $request->isbn,
                    'quantity' => $request->quantity,
                    'unit_price' => $request->unit_price,
                    'format' => $request->format,
                    'edition' => $request->edition,
                    'description' => $request->description,
                ]);

                if ($request->hasFile('cover_url')) {
                    if ($mainCopy->media && $mainCopy->media->img_path) {
                        Storage::disk('public')->delete($mainCopy->media->img_path);
                    }
                    
                    $path = $request->file('cover_url')->store('covers', 'public');
                    Media::updateOrCreate(
                        ['bcopy_id' => $mainCopy->id],
                        ['img_path' => $path]
                    );
                }
            }

            DB::commit();
            return redirect()->route('admin.dashboard')->with('success', 'Book updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Update failed: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete(); 
        
        return redirect()->route('admin.dashboard')->with('success', 'Book deleted successfully');
    }
}