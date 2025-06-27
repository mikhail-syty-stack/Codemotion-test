<?php

namespace App\Http\Requests;

use App\Models\Balance;
use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Brick\Math\BigDecimal;

class CreateOfferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $item = Item::find($this->input('item_id'));

        if (!$item) {
            return false;
        }

        // Check if user is not trying to buy their own item
        if ($item->current_owner_id === Auth::id()) {
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
            'item_id' => [
                'required',
                'exists:items,id',
                function ($attribute, $value, $fail) {
                    $item = Item::find($value);

                    if (!$item->is_listed) {
                        $fail('This item is not listed for sale.');
                    }
                },
            ],
            'price' => [
                'required',
                'min:1',
                function ($attribute, $value, $fail) {
                    $user = Auth::user();

                    $balance = $user->balance;
                    if ($balance->amount->isLessThan(BigDecimal::of($value))) {
                        $fail('Insufficient balance to make this offer.');
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
            'item_id.required' => 'An item must be selected.',
            'item_id.exists' => 'The selected item does not exist.',
            'price.required' => 'Please specify an offer price.',
            'price.integer' => 'The price must be a whole number.',
            'price.min' => 'The price must be at least $1.',
        ];
    }
}
