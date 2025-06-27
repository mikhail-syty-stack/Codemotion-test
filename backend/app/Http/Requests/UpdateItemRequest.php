<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'string|max:255',
            'image_url' => 'url|max:255',
            'price' => 'numeric|min:0|regex:/^\d+(\.\d{1,2})?$/',
            'is_listed' => 'boolean',
            'metadata' => 'nullable|array',
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