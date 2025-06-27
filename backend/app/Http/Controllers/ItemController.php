<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Services\ItemService;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ItemController extends Controller
{
    use AuthorizesRequests;

    protected ItemService $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

    /**
     * Display a listing of the items.
     */
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = $request->only(['is_listed', 'owner_id', 'creator_id']);
        $items = $this->itemService->list($filters);
        return ItemResource::collection($items);
    }

    /**
     * Get items owned by the authenticated user
     */
    public function getMyItems(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = $request->only(['is_listed']);
        $items = $this->itemService->myItems($filters);
        return ItemResource::collection($items);
    }

    /**
     * Store a newly created item.
     */
    public function store(StoreItemRequest $request): \Illuminate\Http\JsonResponse
    {
        $item = $this->itemService->create($request->validated());
        return (new ItemResource($item))->response()->setStatusCode(201);
    }

    /**
     * Display the specified item.
     */
    public function show(Item $item): ItemResource
    {
        return new ItemResource($item->load(['creator', 'currentOwner']));
    }

    /**
     * Update the specified item.
     */
    public function update(UpdateItemRequest $request, Item $item): ItemResource
    {
        $this->authorize('update', $item);
        $item = $this->itemService->update($item, $request->validated());
        return new ItemResource($item);
    }

    /**
     * Remove the specified item.
     */
    public function destroy(Item $item): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $item);
        if ($item->offers()->exists() || $item->transactions()->exists()) {
            return response()->json([
                'message' => 'Cannot delete item with associated offers or transactions'
            ], 409);
        }
        $this->itemService->delete($item);
        return response()->json(null, 204);
    }
}
