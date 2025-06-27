<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
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
            'title' => $this->title,
            'image_url' => $this->image_url,
            'price' => $this->price,
            'is_listed' => $this->is_listed,
            'metadata' => $this->metadata,
            'creator' => [
                'id' => $this->creator?->id,
                'email' => $this->creator?->email,
            ],
            'current_owner' => [
                'id' => $this->currentOwner?->id,
                'email' => $this->currentOwner?->email,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 