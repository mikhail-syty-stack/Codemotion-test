<?php

namespace Database\Factories;

use App\Models\User;
use Brick\Math\BigDecimal;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    /**
     * Array of digital item categories
     */
    private array $categories = [
        'digital art',
        'nft',
        'crypto art',
        'digital collectible',
        'virtual asset'
    ];

    private array $itemTitles = [
        'Cosmic Dreams #',
        'Digital Genesis #',
        'Pixel Perfect #',
        'Virtual Reality #',
        'Cyber Evolution #',
        'Digital Soul #',
        'Future Vision #',
        'Meta Realm #',
        'Digital Echo #',
    ];

    private array $sets = [
        'classic' => '', // Classic robots
        'monsters' => 'set2', // Monsters
        'heads' => 'set3', // Robotic heads
        'cats' => 'set4', // Cats
    ];

    public function definition(): array
    {
        static $counter = 1;
        
        $category = $this->categories[array_rand($this->categories)];
        $setKey = array_rand($this->sets);
        $set = $this->sets[$setKey];
        
        // Use RoboHash to generate unique robot images
        // Format: https://robohash.org/{TEXT}.png?set={SET}
        // Add counter to seed to guarantee uniqueness
        $seed = "digital-item-{$counter}-{$category}";
        $setParam = $set ? "?set={$set}" : "";
        $imageUrl = "https://robohash.org/{$seed}.png{$setParam}";
        
        $titleBase = $this->itemTitles[($counter - 1) % count($this->itemTitles)];
        $title = $titleBase . $counter;

        return [
            'title' => $title,
            'image_url' => $imageUrl,
            'creator_id' => fn() => User::factory(),
            'current_owner_id' => fn(array $attributes) => $attributes['creator_id'],
            'price' => BigDecimal::of(fake()->numberBetween(100, 50000)), // $1.00 - $500.00
            'is_listed' => true,
            'metadata' => [
                'description' => "A unique {$category} piece featuring a generated character. Edition #" . $counter++,
                'tags' => [$category, 'digital', 'art', 'unique', 'generated'],
                'category' => $category,
                'set' => $setKey,
            ],
        ];
    }
}
