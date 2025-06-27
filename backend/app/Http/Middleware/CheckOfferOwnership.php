<?php

namespace App\Http\Middleware;

use App\Models\Offer;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckOfferOwnership
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role = 'any')
    {
        $offer = $request->route('offer');

        if (!$offer instanceof Offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $userId = Auth::id();
        $isAuthorized = match($role) {
            'buyer' => $offer->buyer_id === $userId,
            'seller' => $offer->seller_id === $userId,
            'any' => $offer->buyer_id === $userId || $offer->seller_id === $userId,
            default => false,
        };

        if (!$isAuthorized) {
            return response()->json(['message' => 'Not authorized to access this offer'], 403);
        }

        return $next($request);
    }
} 