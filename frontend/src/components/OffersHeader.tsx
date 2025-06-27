import { useState, useEffect } from 'react';
import { offersAPI } from '../services/api';
import OfferCard from './OfferCard';

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
}

export default function OffersHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeRole, setActiveRole] = useState<'buyer' | 'seller' | ''>('');

    const loadOffers = async (role?: 'buyer' | 'seller') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await offersAPI.getOffers(role ? { role } : {});
            setOffers(response.data);
        } catch (err) {
            setError('Failed to load offers');
            console.error('Error loading offers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadOffers(activeRole || undefined);
        }
    }, [isOpen, activeRole]);

    const handleRoleChange = (role: 'buyer' | 'seller' | '') => {
        setActiveRole(role);
    };

    const pendingOffersCount = offers.filter(offer => offer.status === 'pending').length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
            >
                <span>Offers</span>
                {pendingOffersCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                        {pendingOffersCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-screen max-w-2xl bg-white rounded-lg shadow-lg z-50 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">My Offers</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleRoleChange('')}
                                className={`px-3 py-1 rounded ${
                                    activeRole === '' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleRoleChange('seller')}
                                className={`px-3 py-1 rounded ${
                                    activeRole === 'seller' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                As Seller
                            </button>
                            <button
                                onClick={() => handleRoleChange('buyer')}
                                className={`px-3 py-1 rounded ${
                                    activeRole === 'buyer' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                As Buyer
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-center py-4">{error}</div>
                    ) : offers.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">
                            No offers found
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {offers.map(offer => (
                                <OfferCard
                                    key={offer.id}
                                    offer={offer}
                                    onStatusUpdate={() => loadOffers(activeRole || undefined)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 