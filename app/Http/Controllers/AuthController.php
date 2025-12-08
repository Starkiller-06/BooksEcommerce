<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function login() {
        return Inertia::render('auth/login');
    }

    public function store(Request $request) {
        $credentials = $request->validate([
            'email'=>['required', 'email'],
            'password'=>['required']
        ]);
        if(Auth::attempt($credentials)){
            $request->session()->regenerate();

            $user = $request->user();

            if($user->role=='admin'){
                return redirect()->intended('/admin/dashboard');
            }

            return redirect()->intended('home');
        }
    }

    public function register() {
        return Inertia::render('auth/register');
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'first_name'=>'required|string|max:30',
            'last_name'=>'required|string|max:30',
            'email'=>'required|string|email|max:50|unique:users',
            'password'=>'required|string|min:8'
        ]);

        $user = User::create([
            'first_name'=>$validated['first_name'],
            'last_name'=>$validated['last_name'],
            'email'=>$validated['email'],
            'password'=>$validated['password'],
            'role'=>'customer',
        ]);

        Auth::login($user);

        event(new Registered($user));
        return redirect('home');
    }

}
