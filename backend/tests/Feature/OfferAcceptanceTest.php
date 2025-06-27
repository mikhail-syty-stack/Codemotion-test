<?php

namespace Tests\Feature;

use App\Enum\OfferStatusEnum;
use App\Models\Balance;
use App\Models\Item;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class OfferAcceptanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        DB::beginTransaction();
    }

    protected function tearDown(): void
    {
        DB::rollBack();
        parent::tearDown();
    }

    public function test_accepting_offer_declines_other_offers(): void
    {
        // Create seller with balance
        $seller = User::factory()->create();
        $sellerBalance = Balance::factory()->create([
            'user_id' => $seller->id,
            'amount' => 0
        ]);

        // Create item owned by seller
        $item = Item::factory()->create([
            'creator_id' => $seller->id,
            'current_owner_id' => $seller->id,
            'price' => 10000, // $100.00
            'is_listed' => true
        ]);

        // Create first buyer with sufficient balance
        $buyer1 = User::factory()->create();
        $buyer1Balance = Balance::factory()->create([
            'user_id' => $buyer1->id,
            'amount' => 15000 // $150.00
        ]);

        // Create second buyer with sufficient balance
        $buyer2 = User::factory()->create();
        $buyer2Balance = Balance::factory()->create([
            'user_id' => $buyer2->id,
            'amount' => 15000 // $150.00
        ]);

        // Create two offers for the same item
        $offer1 = Offer::factory()->create([
            'item_id' => $item->id,
            'buyer_id' => $buyer1->id,
            'seller_id' => $seller->id,
            'price' => 10000, // $100.00
            'status' => OfferStatusEnum::Pending
        ]);

        $offer2 = Offer::factory()->create([
            'item_id' => $item->id,
            'buyer_id' => $buyer2->id,
            'seller_id' => $seller->id,
            'price' => 12000, // $120.00
            'status' => OfferStatusEnum::Pending
        ]);

        // Accept first offer
        $this->actingAs($seller);
        $response = $this->post("/api/offers/{$offer1->id}/accept");

        // If test fails, dump response content
        if ($response->status() !== 200) {
            dump('Response status: ' . $response->status());
            dump('Response content: ' . $response->content());
        }

        // Assert response is successful
        $response->assertStatus(200);

        // Assert first offer is accepted
        $this->assertEquals(OfferStatusEnum::Accepted, $offer1->fresh()->status);

        // Assert second offer is declined
        $this->assertEquals(OfferStatusEnum::Declined, $offer2->fresh()->status);

        // Assert balances are updated correctly
        $this->assertEquals('5000', $buyer1->balance->fresh()->amount->toScale(0)); // $50.00 remaining
        $this->assertEquals('10000', $seller->balance->fresh()->amount->toScale(0)); // $100.00 received
        $this->assertEquals('15000', $buyer2->balance->fresh()->amount->toScale(0)); // No change

        // Assert item ownership is transferred
        $item->refresh();
        $this->assertEquals($buyer1->id, $item->current_owner_id);
        $this->assertFalse($item->is_listed);
    }

    public function test_cannot_accept_offer_with_insufficient_buyer_balance(): void
    {
        // Create seller with balance
        $seller = User::factory()->create();
        $sellerBalance = Balance::factory()->create([
            'user_id' => $seller->id,
            'amount' => 0
        ]);

        // Create item owned by seller
        $item = Item::factory()->create([
            'creator_id' => $seller->id,
            'current_owner_id' => $seller->id,
            'price' => 10000, // $100.00
            'is_listed' => true
        ]);

        // Create buyer with insufficient balance
        $buyer = User::factory()->create();
        $buyerBalance = Balance::factory()->create([
            'user_id' => $buyer->id,
            'amount' => 5000 // $50.00
        ]);

        // Create offer
        $offer = Offer::factory()->create([
            'item_id' => $item->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'price' => 10000, // $100.00
            'status' => OfferStatusEnum::Pending
        ]);

        // Try to accept offer
        $this->actingAs($seller);
        $response = $this->post("/api/offers/{$offer->id}/accept");

        // If test fails, dump response content
        if ($response->status() !== 400) {
            dump('Response status: ' . $response->status());
            dump('Response content: ' . $response->content());
        }

        // Assert response indicates error
        $response->assertStatus(400);
        $response->assertJson(['message' => 'Insufficient buyer balance']);

        // Assert offer status hasn't changed
        $this->assertEquals(OfferStatusEnum::Pending, $offer->fresh()->status);

        // Assert no balances were changed
        $this->assertEquals('5000', $buyer->balance->fresh()->amount->toScale(0));
        $this->assertEquals('0', $seller->balance->fresh()->amount->toScale(0));

        // Assert item ownership hasn't changed
        $item->refresh();
        $this->assertEquals($seller->id, $item->current_owner_id);
        $this->assertTrue($item->is_listed);
    }

    public function test_cannot_accept_non_pending_offer(): void
    {
        // Create seller with balance
        $seller = User::factory()->create();
        $sellerBalance = Balance::factory()->create([
            'user_id' => $seller->id,
            'amount' => 0
        ]);

        // Create item owned by seller
        $item = Item::factory()->create([
            'creator_id' => $seller->id,
            'current_owner_id' => $seller->id,
            'price' => 10000, // $100.00
            'is_listed' => true
        ]);

        // Create buyer with sufficient balance
        $buyer = User::factory()->create();
        $buyerBalance = Balance::factory()->create([
            'user_id' => $buyer->id,
            'amount' => 15000 // $150.00
        ]);

        // Create declined offer
        $offer = Offer::factory()->create([
            'item_id' => $item->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'price' => 10000, // $100.00
            'status' => OfferStatusEnum::Declined
        ]);

        // Try to accept declined offer
        $this->actingAs($seller);
        $response = $this->post("/api/offers/{$offer->id}/accept");

        // If test fails, dump response content
        if ($response->status() !== 400) {
            dump('Response status: ' . $response->status());
            dump('Response content: ' . $response->content());
        }

        // Assert response indicates error
        $response->assertStatus(400);
        $response->assertJson(['message' => 'Only pending offers can be accepted']);

        // Assert no balances were changed
        $this->assertEquals('15000', $buyer->balance->fresh()->amount->toScale(0));
        $this->assertEquals('0', $seller->balance->fresh()->amount->toScale(0));

        // Assert item ownership hasn't changed
        $item->refresh();
        $this->assertEquals($seller->id, $item->current_owner_id);
        $this->assertTrue($item->is_listed);
    }
} 