<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_id' => 'required|integer|exists:items,id',
            'price' => 'required|numeric|min:0|regex:/^\d+(\.\d{1,2})?$/',
        ];
    }

    public function messages(): array
    {
        return [
            'price.numeric' => 'The price must be a valid number.',
            'price.min' => 'The price must be at least $0.',
            'price.regex' => 'The price must have at most 2 decimal places.',
        ];
    }
} 