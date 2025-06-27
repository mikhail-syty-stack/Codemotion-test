<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');

    // Balance routes
    Route::get('/balance', [BalanceController::class, 'show'])->name('balance.show');
    Route::post('/balance/add', [BalanceController::class, 'addFunds'])->name('balance.add');
    Route::post('/balance/withdraw', [BalanceController::class, 'withdrawFunds'])->name('balance.withdraw');

    // Item routes
    Route::get('/items/my', [ItemController::class, 'getMyItems'])->name('items.my');
    Route::apiResource('items', ItemController::class);

    // Offer routes
    Route::post('/offers/{offer}/accept', [OfferController::class, 'accept']);
    Route::post('/offers/{offer}/decline', [OfferController::class, 'decline']);
    Route::apiResource('offers', OfferController::class)->except(['update']);
    
    // Transaction routes
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('/offers/{offer}/process', [TransactionController::class, 'processOffer'])->name('transactions.process-offer');
}); 