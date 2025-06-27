<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use App\Http\Requests\BalanceFundsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BalanceController extends Controller
{
    protected BalanceService $balanceService;

    public function __construct(BalanceService $balanceService)
    {
        $this->balanceService = $balanceService;
    }

    /**
     * Get user's balance
     */
    public function show(): \Illuminate\Http\JsonResponse
    {
        $result = $this->balanceService->getBalance(Auth::user());
        return response()->json($result);
    }

    /**
     * Add funds to user's balance
     */
    public function addFunds(BalanceFundsRequest $request): \Illuminate\Http\JsonResponse
    {
        $result = $this->balanceService->addFunds(Auth::user(), $request->input('amount'));
        return response()->json($result);
    }

    /**
     * Withdraw funds from user's balance
     */
    public function withdrawFunds(BalanceFundsRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->balanceService->withdrawFunds(Auth::user(), $request->input('amount'));
            return response()->json($result);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
} 