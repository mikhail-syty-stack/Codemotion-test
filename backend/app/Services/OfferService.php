<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\Item;
use App\Models\Balance;
use App\Models\Transaction;
use App\Enum\OfferStatusEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OfferService
{
    /**
     * Accept an offer and process the transaction
     */
    public function acceptOffer(Offer $offer): array
    {
        if ($offer->status !== OfferStatusEnum::Pending) {
            throw new \InvalidArgumentException('Only pending offers can be accepted');
        }

        try {
            DB::beginTransaction();

            // Update offer status
            $offer->status = OfferStatusEnum::Accepted;
            $offer->save();

            // Decline all other pending offers for this item
            Offer::where('item_id', $offer->item_id)
                ->where('id', '!=', $offer->id)
                ->where('status', OfferStatusEnum::Pending)
                ->update(['status' => OfferStatusEnum::Declined->value]);

            // Create transaction record
            $transaction = new Transaction([
                'item_id' => $offer->item_id,
                'buyer_id' => $offer->buyer_id,
                'offer_id' => $offer->id,
                'seller_id' => $offer->seller_id,
                'amount' => $offer->price,
                'original_price' => $offer->item->price,
            ]);
            $transaction->save();

            // Update buyer's balance
            $buyerBalance = Balance::where('user_id', $offer->buyer_id)->firstOrFail();
            if ($buyerBalance->amount->isLessThan($offer->price)) {
                throw new \InvalidArgumentException('Insufficient buyer balance');
            }
            $buyerBalance->amount = $buyerBalance->amount->minus($offer->price);
            $buyerBalance->save();

            // Update seller's balance
            $sellerBalance = Balance::where('user_id', $offer->seller_id)->firstOrFail();
            $sellerBalance->amount = $sellerBalance->amount->plus($offer->price);
            $sellerBalance->save();

            // Update item ownership
            $item = Item::findOrFail($offer->item_id);
            $item->current_owner_id = $offer->buyer_id;
            $item->is_listed = false;
            $item->save();

            DB::commit();

            return [
                'message' => 'Offer accepted and transaction completed successfully',
                'offer' => $offer->fresh()->load(['item', 'buyer', 'seller']),
                'transaction' => $transaction->load(['item', 'buyer', 'seller'])
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Decline an offer
     */
    public function declineOffer(Offer $offer): array
    {
        if ($offer->status !== OfferStatusEnum::Pending) {
            throw new \InvalidArgumentException('Only pending offers can be declined');
        }

        $offer->status = OfferStatusEnum::Declined;
        $offer->save();

        return [
            'message' => 'Offer declined successfully',
            'offer' => $offer->fresh()->load(['item', 'buyer', 'seller'])
        ];
    }

    /**
     * Get offers for the authenticated user (with filters)
     */
    public function list(array $filters = [], $userId): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Offer::with(['item', 'buyer', 'seller']);
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
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query->latest()->paginate(20);
    }

    /**
     * Create a new offer
     */
    public function create(array $data, $user): Offer
    {
        $item = Item::findOrFail($data['item_id']);
        if (!$item->is_listed) {
            throw new \InvalidArgumentException('This item is not listed for sale');
        }
        if ($item->current_owner_id === $user->id) {
            throw new \InvalidArgumentException('You cannot make an offer for your own item');
        }
        $existingOffer = Offer::where('item_id', $item->id)
            ->where('buyer_id', $user->id)
            ->where('status', OfferStatusEnum::Pending)
            ->first();
        if ($existingOffer) {
            throw new \InvalidArgumentException('You already have a pending offer for this item');
        }
        $balance = $user->balance;
        if ($balance->amount->isLessThan($data['price'])) {
            throw new \InvalidArgumentException('Insufficient balance');
        }
        $offer = new Offer([
            'item_id' => $item->id,
            'buyer_id' => $user->id,
            'seller_id' => $item->current_owner_id,
            'price' => $data['price'],
            'status' => OfferStatusEnum::Pending,
        ]);
        $offer->save();
        return $offer->load(['item', 'buyer', 'seller']);
    }

    /**
     * Delete (cancel) an offer
     */
    public function delete(Offer $offer): void
    {
        if ($offer->status !== OfferStatusEnum::Pending) {
            throw new \InvalidArgumentException('Cannot cancel an offer that has been ' . strtolower($offer->status));
        }
        $offer->delete();
    }
}
