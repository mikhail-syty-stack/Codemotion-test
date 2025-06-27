import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

interface User {
    id: number;
    email: string;
}

interface Item {
    id: number;
    title: string;
    image_url: string;
    price: number;
    is_listed: boolean;
    creator: User;
    current_owner: User;
    metadata?: Record<string, unknown>;
}

type SortOption = 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
type ListingFilter = '' | 'listed' | 'unlisted';

export default function MyItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        image_url: '',
        price: 0,
        is_listed: false
    });

    // Filters and search
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [listingFilter, setListingFilter] = useState<ListingFilter>('');
    const [sortBy, setSortBy] = useState<SortOption>('title_asc');

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        filterAndSortItems();
    }, [items, searchQuery, minPrice, maxPrice, listingFilter, sortBy]);

    const loadItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await itemsAPI.getMyItems();
            setItems(response.data);
        } catch (err) {
            setError('Failed to load items');
            console.error('Error loading items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortItems = () => {
        let result = [...items];

        // Search by title
        if (searchQuery) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by price
        if (minPrice !== '') {
            result = result.filter(item => item.price >= Number(minPrice));
        }
        if (maxPrice !== '') {
            result = result.filter(item => item.price <= Number(maxPrice));
        }

        // Filter by listing status
        if (listingFilter === 'listed') {
            result = result.filter(item => item.is_listed);
        } else if (listingFilter === 'unlisted') {
            result = result.filter(item => !item.is_listed);
        }

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'title_asc':
                result.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
                break;
            case 'title_desc':
                result.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
                break;
        }

        setFilteredItems(result);
    };

    const handleCreateItem = async () => {
        try {
            const response = await itemsAPI.createItem(newItem);
            const createdItem = response.data ? response.data : response;
            setItems(prevItems => [...prevItems, createdItem]);
            setIsCreating(false);
            setNewItem({
                title: '',
                image_url: '',
                price: 0,
                is_listed: false
            });
        } catch (err) {
            console.error('Error creating item:', err);
        }
    };

    const handleUpdateItem = async (id: number, data: any) => {
        try {
            const response = await itemsAPI.updateItem(id, data);
            const updatedItem = response.data ? response.data : response;
            console.log('API updateItem response:', updatedItem);
            setItems(prevItems => {
                const newItems = prevItems.map(item =>
                    item.id === id ? updatedItem : item
                );
                console.log('Items after update:', newItems);
                return newItems;
            });
            return updatedItem;
        } catch (error: any) {
            console.error('Error updating item:', error);
            throw error;
        }
    };

    const handleDeleteItem = async (id: number) => {
        try {
            await itemsAPI.deleteItem(id);
            setItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error: any) {
            console.error('Error deleting item:', error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Items</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    Create New Item
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                    {error}
                </div>
            )}

            {/* Modal for creating an item */}
            {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Create New Item</h2>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    placeholder="Item Title"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={newItem.image_url}
                                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                                    placeholder="Image URL"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                    placeholder="Price"
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newItem.is_listed}
                                    onChange={(e) => setNewItem({ ...newItem, is_listed: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-700">List for sale</label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and search */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search by Title
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search items..."
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Price
                        </label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min price"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price
                        </label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max price"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="title_asc">Title: A to Z</option>
                            <option value="title_desc">Title: Z to A</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Status
                    </label>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setListingFilter('')}
                            className={`px-3 py-1 rounded ${
                                listingFilter === ''
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setListingFilter('listed')}
                            className={`px-3 py-1 rounded ${
                                listingFilter === 'listed'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Listed
                        </button>
                        <button
                            onClick={() => setListingFilter('unlisted')}
                            className={`px-3 py-1 rounded ${
                                listingFilter === 'unlisted'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Unlisted
                        </button>
                    </div>
                </div>
            </div>

            {/* Item list */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500">No items found</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onDelete={handleDeleteItem}
                            onUpdate={handleUpdateItem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 