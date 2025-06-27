<?php

namespace App\Enum;

enum OfferStatusEnum: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Declined = 'declined';
}
