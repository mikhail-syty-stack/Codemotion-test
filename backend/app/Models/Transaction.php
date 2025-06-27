<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\HandlesMoney;

/**
 * 
 *
 * @property int $id
 * @property int $item_id
 * @property int $buyer_id
 * @property int $seller_id
 * @property int $offer_id
 * @property int $amount
 * @property int $original_price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $buyer
 * @property \Brick\Math\BigDecimal $money
 * @property-read \App\Models\Item $item
 * @property-read \App\Models\User $seller
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereBuyerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereOfferId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereOriginalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereSellerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    use HasFactory, HandlesMoney;

    protected $fillable = [
        'item_id',
        'buyer_id',
        'offer_id',
        'seller_id',
        'amount',
        'original_price',
    ];

    protected $casts = [
        'amount' => 'integer',
        'original_price' => 'integer'
    ];

    protected $appends = [
        'amount',
        'original_price'
    ];

    public function getAmountAttribute()
    {
        return $this->getMoneyAttribute('amount');
    }

    public function setAmountAttribute($value): void
    {
        $this->setMoneyAttribute('amount', $value);
    }

    public function getOriginalPriceAttribute()
    {
        return $this->getMoneyAttribute('original_price');
    }

    public function setOriginalPriceAttribute($value): void
    {
        $this->setMoneyAttribute('original_price', $value);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
