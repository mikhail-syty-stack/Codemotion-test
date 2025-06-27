import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { itemsAPI, offersAPI } from '../services/api';
import { formatPrice } from '../utils/formatters';

interface Item {
    id: number;
    title: string;
    image_url: string;
    price: number;
    is_listed: boolean;
    creator: {
        id: number;
        email: string;
    };
    current_owner: {
        id: number;
        email: string;
    };
    metadata?: Record<string, unknown>;
}

type SortOption = 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';

export default function Marketplace() {
    const { user } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [offerPrice, setOfferPrice] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('price_asc');

    useEffect(() => {
        loadListedItems();
    }, []);

    useEffect(() => {
        filterAndSortItems();
    }, [items, searchQuery, minPrice, maxPrice, sortBy]);

    const loadListedItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await itemsAPI.getAllItems({ is_listed: true });
            const filteredItems = response.data.filter((item: Item) => item.current_owner.id !== user?.id);
            setItems(filteredItems);
        } catch (err) {
            setError('Failed to load marketplace items');
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

        // Filter by price (convert entered dollars to cents)
        if (minPrice !== '') {
            const minPriceCents = Math.round(parseFloat(minPrice) * 100);
            result = result.filter(item => item.price >= minPriceCents);
        }
        if (maxPrice !== '') {
            const maxPriceCents = Math.round(parseFloat(maxPrice) * 100);
            result = result.filter(item => item.price <= maxPriceCents);
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
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title_desc':
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        setFilteredItems(result);
    };

    const handleMakeOffer = async (item: Item) => {
        setSelectedItem(item);
        setOfferPrice(item.price);
    };

    const handleSubmitOffer = async () => {
        if (!selectedItem) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await offersAPI.createOffer({
                item_id: selectedItem.id,
                price: offerPrice
            });
            setSelectedItem(null);
            setOfferPrice(0);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit offer');
            console.error('Error submitting offer:', err);
        } finally {
            setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                    {error}
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
                            Min Price ($)
                        </label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min price"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price ($)
                        </label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max price"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
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
            </div>

            {/* Modal for creating an offer */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Make an Offer</h2>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <img
                                    src={selectedItem.image_url}
                                    alt={selectedItem.title}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="ml-4">
                                    <h3 className="font-semibold">{selectedItem.title}</h3>
                                    <p className="text-gray-600">Listed Price: {formatPrice(selectedItem.price)}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Offer Price ($)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {offerPrice > selectedItem.price && (
                                    <div className="text-yellow-600 bg-yellow-50 p-3 rounded">
                                        Your offer is higher than the listed price. You might want to consider buying at the listed price instead.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitOffer}
                                disabled={isSubmitting || offerPrice <= 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 min-w-[100px]"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Submit Offer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Item list */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500">
                        {items.length === 0
                            ? 'No items are currently listed for sale.'
                            : 'No items match your search criteria.'}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-gray-600">Price: {formatPrice(item.price)}</p>
                                <p className="text-sm text-gray-500">
                                    Owner: {item.current_owner.email}
                                </p>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleMakeOffer(item)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Make Offer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 