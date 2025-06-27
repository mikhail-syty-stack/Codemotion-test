<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Offer;
use App\Models\Item;
use App\Models\Balance;
use App\Enum\OfferStatusEnum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function list(array $filters = [], $userId)
    {
        $query = Transaction::with(['item', 'buyer', 'seller']);
        if (isset($filters['role'])) {
            if ($filters['role'] === 'buyer') {
                $query->where('buyer_id', $userId);
            } elseif ($filters['role'] === 'seller') {
                $query->where('seller_id', $userId);
            }
        } else {
            $query->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)
                  ->orWhere('seller_id', $userId);
            });
        }
        return $query->latest()->paginate(20);
    }

    public function processOffer(Offer $offer, $user)
    {
        if ($offer->seller_id !== $user->id) {
            throw new \Exception('Not authorized');
        }
        if ($offer->status !== OfferStatusEnum::Accepted) {
            throw new \InvalidArgumentException('Can only process accepted offers');
        }
        try {
            DB::beginTransaction();
            $transaction = new Transaction([
                'item_id' => $offer->item_id,
                'buyer_id' => $offer->buyer_id,
                'seller_id' => $offer->seller_id,
                'amount' => $offer->price,
                'original_price' => $offer->item->price,
            ]);
            $transaction->save();
            $buyerBalance = Balance::where('user_id', $offer->buyer_id)->firstOrFail();
            $buyerBalance->amount = $buyerBalance->amount->minus($offer->price);
            $buyerBalance->save();
            $sellerBalance = Balance::where('user_id', $offer->seller_id)->firstOrFail();
            $sellerBalance->amount = $sellerBalance->amount->plus($offer->price);
            $sellerBalance->save();
            $item = Item::findOrFail($offer->item_id);
            $item->current_owner_id = $offer->buyer_id;
            $item->is_listed = false;
            $item->save();
            $offer->status = 'completed';
            $offer->save();
            DB::commit();
            return [
                'message' => 'Transaction completed successfully',
                'transaction' => $transaction->load(['item', 'buyer', 'seller'])
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Transaction $transaction, $user)
    {
        if ($transaction->buyer_id !== $user->id && $transaction->seller_id !== $user->id) {
            throw new \Exception('Not authorized');
        }
        return $transaction->load(['item', 'buyer', 'seller']);
    }
} 