import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';

interface User {
    id: number;
    email: string;
}

interface Item {
    id: number;
    title: string;
    image_url: string;
    price: number;
}

interface Offer {
    id: number;
    item: Item;
    buyer: User;
    seller: User;
    price: number;
    status: string;
}

interface OfferCardProps {
    offer: Offer;
    onStatusUpdate: (offerId: number, status: string) => Promise<void>;
}

export default function OfferCard({ offer, onStatusUpdate }: OfferCardProps) {
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isSeller = user?.id === offer.seller.id;

    const handleStatusUpdate = async (status: string) => {
        if (!window.confirm(`Are you sure you want to ${status} this offer?`)) {
            return;
        }

        setIsUpdating(true);
        setError(null);
        try {
            await onStatusUpdate(offer.id, status);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Failed to ${status} offer`;
            setError(errorMessage);
            console.error(`Failed to ${status} offer:`, error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                    {error}
                </div>
            )}
            <div className="flex items-center space-x-4">
                <img
                    src={offer.item.image_url}
                    alt={offer.item.title}
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{offer.item.title}</h3>
                    <p className="text-gray-600">
                        Original Price: {formatPrice(offer.item.price)}
                    </p>
                    <p className="text-blue-600 font-medium">
                        Offer: {formatPrice(offer.price)}
                    </p>
                    <div className="mt-2 text-sm">
                        {isSeller ? (
                            <p>From: {offer.buyer.email}</p>
                        ) : (
                            <p>To: {offer.seller.email}</p>
                        )}
                    </div>
                    <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            offer.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : offer.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : offer.status === 'declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                    </div>
                    {isSeller && offer.status === 'pending' && (
                        <div className="mt-4 space-x-2">
                            <button
                                onClick={() => handleStatusUpdate('accepted')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('declined')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 