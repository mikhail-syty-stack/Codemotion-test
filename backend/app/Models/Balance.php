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
 * @property int $user_id
 * @property int $amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Brick\Math\BigDecimal $money
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\BalanceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Balance whereUserId($value)
 * @mixin \Eloquent
 */
class Balance extends Model
{
    use HasFactory, HandlesMoney;

    protected $fillable = [
        'user_id',
        'amount',
    ];

    protected $casts = [
        'amount' => 'integer'
    ];

    public function getAmountAttribute($value)
    {
        return $this->getMoneyAttribute('amount');
    }

    public function setAmountAttribute($value): void
    {
        $this->setMoneyAttribute('amount', $value);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
