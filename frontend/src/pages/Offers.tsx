import { useState, useEffect } from 'react';
import { offersAPI } from '../services/api';
import OfferCard from '../components/OfferCard';

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
}

interface Offer {
    id: number;
    item: Item;
    buyer: User;
    seller: User;
    price: number;
    status: string;
    created_at: string;
}

type SortOption = 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
type RoleFilter = '' | 'buyer' | 'seller';
type StatusFilter = '' | 'pending' | 'accepted' | 'declined';

export default function Offers() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
    const [sortBy, setSortBy] = useState<SortOption>('date_desc');

    useEffect(() => {
        loadOffers();
    }, [roleFilter]);

    useEffect(() => {
        filterAndSortOffers();
    }, [offers, searchQuery, minPrice, maxPrice, statusFilter, sortBy]);

    const loadOffers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await offersAPI.getOffers(roleFilter ? { role: roleFilter } : {});
            setOffers(response.data);
        } catch (err) {
            setError('Failed to load offers');
            console.error('Error loading offers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortOffers = () => {
        let result = [...offers];

        // Search by item title
        if (searchQuery) {
            result = result.filter(offer =>
                offer.item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by price
        if (minPrice !== '') {
            result = result.filter(offer => offer.price >= Number(minPrice));
        }
        if (maxPrice !== '') {
            result = result.filter(offer => offer.price <= Number(maxPrice));
        }

        // Filter by status
        if (statusFilter) {
            result = result.filter(offer => offer.status === statusFilter);
        }

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'date_asc':
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'date_desc':
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        setFilteredOffers(result);
    };

    const handleStatusUpdate = async (offerId: number, status: string) => {
        if (status === 'accepted') {
            await offersAPI.acceptOffer(offerId);
        } else if (status === 'declined') {
            await offersAPI.declineOffer(offerId);
        }
        await loadOffers();
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
            <h1 className="text-3xl font-bold mb-8">My Offers</h1>
            
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
                            Search by Item Title
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
                            <option value="date_desc">Date: Newest First</option>
                            <option value="date_asc">Date: Oldest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Roles</option>
                            <option value="seller">As Seller</option>
                            <option value="buyer">As Buyer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Offer list */}
            {filteredOffers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500">No offers found</div>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOffers.map(offer => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 