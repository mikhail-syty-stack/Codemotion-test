<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferRequest;
use App\Http\Resources\OfferResource;
use App\Models\Offer;
use App\Services\OfferService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;

    protected OfferService $offerService;

    public function __construct(OfferService $offerService)
    {
        $this->offerService = $offerService;
    }

    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            'auth:api',
            new Middleware('check.offer:any', only: ['show']),
            new Middleware('check.offer:seller', only: ['accept', 'decline']),
            new Middleware('check.offer:buyer', only: ['destroy']),
        ];
    }

    /**
     * Get all offers for the authenticated user (both as buyer and seller)
     */
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = $request->only(['role', 'status']);
        $offers = $this->offerService->list($filters, Auth::id());
        return OfferResource::collection($offers);
    }

    /**
     * Create a new offer
     */
    public function store(StoreOfferRequest $request): \Illuminate\Http\JsonResponse
    {
        $offer = $this->offerService->create($request->validated(), Auth::user());
        return (new OfferResource($offer))->response()->setStatusCode(201);
    }

    /**
     * Get specific offer
     */
    public function show(Offer $offer): OfferResource
    {
        $this->authorize('view', $offer);
        return new OfferResource($offer->load(['item', 'buyer', 'seller']));
    }

    /**
     * Accept an offer
     */
    public function accept(Offer $offer): \Illuminate\Http\JsonResponse
    {
        $this->authorize('accept', $offer);
        try {
            $result = $this->offerService->acceptOffer($offer);
            return response()->json($result);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Decline an offer
     */
    public function decline(Offer $offer): \Illuminate\Http\JsonResponse
    {
        $this->authorize('decline', $offer);
        try {
            $result = $this->offerService->declineOffer($offer);
            return response()->json($result);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Cancel an offer (only for buyer and only if pending)
     */
    public function destroy(Offer $offer): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $offer);
        try {
            $this->offerService->delete($offer);
            return response()->json(null, 204);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
