<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Offer;
use App\Models\Item;
use App\Models\Balance;
use App\Services\TransactionService;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Enum\OfferStatusEnum;

class TransactionController extends Controller
{
    protected TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Get transactions history for the authenticated user
     */
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = $request->only(['role']);
        $transactions = $this->transactionService->list($filters, Auth::id());
        return TransactionResource::collection($transactions);
    }

    /**
     * Process a transaction from an accepted offer
     */
    public function processOffer(Offer $offer): \Illuminate\Http\JsonResponse
    {
        $result = $this->transactionService->processOffer($offer, Auth::user());
        return response()->json($result);
    }

    /**
     * Get specific transaction details
     */
    public function show(Transaction $transaction): TransactionResource
    {
        $transaction = $this->transactionService->show($transaction, Auth::user());
        return new TransactionResource($transaction);
    }
}
