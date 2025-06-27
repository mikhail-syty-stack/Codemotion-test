<?php

namespace Database\Seeders;

use App\Models\Balance;
use App\Models\Item;
use App\Models\User;
use Brick\Math\BigDecimal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 3 users with balances
        $users = User::factory(3)
            ->has(Balance::factory()->state(['amount' => BigDecimal::of(5000)]))
            ->create();

        // Create 3 items for each user
        foreach ($users as $user) {
            Item::factory(3)->create([
                'creator_id' => $user->id,
                'current_owner_id' => $user->id,
                'is_listed' => true,
                'price' => BigDecimal::of(fake()->numberBetween(10, 50)), // $10.00 - $50.00
            ]);
        }
    }
}
