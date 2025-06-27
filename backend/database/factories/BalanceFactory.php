<?php

namespace Database\Factories;

use App\Models\User;
use Brick\Math\BigDecimal;
use Illuminate\Database\Eloquent\Factories\Factory;

class BalanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => BigDecimal::of(fake()->numberBetween(10000, 1000000)),
        ];
    }
} 