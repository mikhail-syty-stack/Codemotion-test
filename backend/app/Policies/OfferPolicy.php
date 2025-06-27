<?php

namespace App\Policies;

use App\Models\Offer;
use App\Models\User;
use App\Enum\OfferStatusEnum;

class OfferPolicy
{
    public function view(User $user, Offer $offer): bool
    {
        return $offer->buyer_id === $user->id || $offer->seller_id === $user->id;
    }

    public function accept(User $user, Offer $offer): bool
    {
        return $offer->seller_id === $user->id && $offer->status === OfferStatusEnum::Pending;
    }

    public function decline(User $user, Offer $offer): bool
    {
        return $offer->seller_id === $user->id && $offer->status === OfferStatusEnum::Pending;
    }

    public function delete(User $user, Offer $offer): bool
    {
        return $offer->buyer_id === $user->id && $offer->status === OfferStatusEnum::Pending;
    }
} 