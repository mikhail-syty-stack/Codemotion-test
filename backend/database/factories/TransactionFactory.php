<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        $offer = Offer::factory()->create(['status' => 'accepted']);
        $item = $offer->item;

        return [
            'item_id' => $item->id,
            'seller_id' => $item->current_owner_id,
            'buyer_id' => $offer->buyer_id,
            'offer_id' => $offer->id,
            'amount' => $offer->price,
            'original_price' => $item->price,
        ];
    }
} 