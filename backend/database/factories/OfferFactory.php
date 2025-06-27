<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\User;
use Brick\Math\BigDecimal;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferFactory extends Factory
{
    public function definition(): array
    {
        $item = Item::factory()->create();

        return [
            'item_id' => $item->id,
            'seller_id' => $item->current_owner_id,
            'buyer_id' => User::factory(),
            'price' => BigDecimal::of(fake()->numberBetween(1000, 5000)),
            'status' => fake()->randomElement(['pending', 'accepted', 'declined']),
        ];
    }

    public function pending(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function accepted(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    public function declined(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'declined',
        ]);
    }
}
