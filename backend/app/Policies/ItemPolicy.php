<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;

class ItemPolicy
{
    public function view(User $user, Item $item): bool
    {
        return true;
    }

    public function update(User $user, Item $item): bool
    {
        return $item->current_owner_id === $user->id;
    }

    public function delete(User $user, Item $item): bool
    {
        return $item->current_owner_id === $user->id;
    }
}
