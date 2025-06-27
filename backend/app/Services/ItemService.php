<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Auth;

class ItemService
{
    public function list(array $filters = [])
    {
        $query = Item::with(['creator', 'currentOwner']);
        if (isset($filters['is_listed'])) {
            $query->where('is_listed', $filters['is_listed']);
        }
        if (isset($filters['owner_id'])) {
            $query->where('current_owner_id', $filters['owner_id']);
        }
        if (isset($filters['creator_id'])) {
            $query->where('creator_id', $filters['creator_id']);
        }
        return $query->paginate(20);
    }

    public function myItems(array $filters = [])
    {
        $query = Item::with(['creator', 'currentOwner'])
            ->where('current_owner_id', Auth::id());
        if (isset($filters['is_listed'])) {
            $query->where('is_listed', $filters['is_listed']);
        }
        return $query->paginate(20);
    }

    public function create(array $data): Item
    {
        $item = new Item($data);
        $item->creator_id = Auth::id();
        $item->current_owner_id = Auth::id();
        $item->save();
        return $item->load(['creator', 'currentOwner']);
    }

    public function update(Item $item, array $data): Item
    {
        $item->update($data);
        return $item->load(['creator', 'currentOwner']);
    }

    public function delete(Item $item): void
    {
        $item->delete();
    }
} 