<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Concerns\HandlesMoney;

/**
 * 
 *
 * @property int $id
 * @property string $title
 * @property string $image_url
 * @property int $creator_id
 * @property int $current_owner_id
 * @property int $price
 * @property bool $is_listed
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $creator
 * @property-read \App\Models\User $currentOwner
 * @property \Brick\Math\BigDecimal $money
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Offer> $offers
 * @property-read int|null $offers_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read int|null $transactions_count
 * @method static \Database\Factories\ItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereCurrentOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereIsListed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Item extends Model
{
    use HasFactory, HandlesMoney;

    protected $fillable = [
        'title',
        'image_url',
        'creator_id',
        'current_owner_id',
        'price',
        'is_listed',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_listed' => 'boolean',
        'price' => 'integer'
    ];

    public function getPriceAttribute($value)
    {
        return $this->getMoneyAttribute('price');
    }

    public function setPriceAttribute($value): void
    {
        $this->setMoneyAttribute('price', $value);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function currentOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_owner_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
