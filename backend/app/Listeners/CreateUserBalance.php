<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Models\Balance;
use Brick\Math\BigDecimal;

class CreateUserBalance
{
    public function handle(UserCreated $event): void
    {
        if ($event->user->balance instanceof Balance) {
            return;
        }

        Balance::create([
            'user_id' => $event->user->id,
            'amount' => BigDecimal::zero()
        ]);
    }
}
