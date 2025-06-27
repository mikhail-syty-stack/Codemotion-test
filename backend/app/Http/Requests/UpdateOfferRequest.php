<?php

namespace App\Http\Requests;

use App\Enum\OfferStatusEnum;
use App\Models\Offer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateOfferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $offer = $this->route('offer');

        // Check if user is the seller
        if ($offer->seller_id !== Auth::id()) {
            return false;
        }

        // Check if offer is still pending
        if ($offer->status !== OfferStatusEnum::Pending) {
            return false;
        }

        // Check if the item is still available and listed
        $item = $offer->item;
        if (!$item->is_listed || $item->current_owner_id !== Auth::id()) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in([
                    OfferStatusEnum::Accepted->value,
                    OfferStatusEnum::Declined->value
                ]),
                function ($attribute, $value, $fail) {
                    if ($value === OfferStatusEnum::Accepted->value) {
                        $offer = $this->route('offer');
                        
                        // Check if buyer still has enough balance
                        if ($offer->buyer->balance->amount < $offer->price) {
                            $fail('Cannot accept offer: buyer has insufficient balance.');
                        }

                        // Check if there are no accepted offers for this item
                        $hasAcceptedOffer = Offer::where('item_id', $offer->item_id)
                            ->where('status', OfferStatusEnum::Accepted)
                            ->exists();
                        
                        if ($hasAcceptedOffer) {
                            $fail('Cannot accept offer: item already has an accepted offer.');
                        }
                    }
                },
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Please specify whether to accept or decline the offer.',
            'status.in' => 'Invalid offer status. Must be either accepted or declined.',
        ];
    }
} 