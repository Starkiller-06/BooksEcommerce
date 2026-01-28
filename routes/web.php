<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;    
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController; 
use App\Http\Controllers\AdminOrderController;
use App\Models\Book;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');


Route::get('/home', [ProductController::class, 'home'])->name('home');


Route::get('/catalog', [ProductController::class, 'index'])->name('product.index');

Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/cart', function () {
    return Inertia::render('cart'); 
})->name('cart.index'); 


//Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove'); 

//Checkout
Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.index');
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');


//Authentication
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'store']);
    Route::post('/register', [AuthController::class, 'create']);
});



// Admin
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        $books = Book::with(['authors', 'genres', 'copies'])->latest()->get();
        
        return Inertia::render('dashboard', [
            'copies' => $books
        ]);
    })->name('admin.dashboard');

    Route::get('/products', [BookController::class, 'index'])->name('admin.inventory');
    Route::get('/create', [BookController::class, 'create'])->name('books.create');
    Route::post('/books', [BookController::class, 'store'])->name('books.store');

    Route::get('/books/{id}/edit', [BookController::class, 'edit'])->name('books.edit');
    Route::put('/books/{id}', [BookController::class, 'update'])->name('books.update');
    Route::delete('/books/{id}', [BookController::class, 'destroy'])->name('books.destroy');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::patch('/orders/{id}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
}); 

require __DIR__.'/settings.php';