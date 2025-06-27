<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'item' => new ItemResource($this->whenLoaded('item')),
            'buyer' => [
                'id' => $this->buyer?->id,
                'email' => $this->buyer?->email,
            ],
            'seller' => [
                'id' => $this->seller?->id,
                'email' => $this->seller?->email,
            ],
            'amount' => $this->amount,
            'original_price' => $this->original_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 