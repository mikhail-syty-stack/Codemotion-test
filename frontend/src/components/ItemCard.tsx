import { useState } from 'react';
import { itemsAPI } from '../services/api';
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

interface ItemCardProps {
    item: Item;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: Partial<Item>) => void;
}

export default function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(item.title);
    const [price, setPrice] = useState(item.price);
    const [isListed, setIsListed] = useState(item.is_listed);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async () => {
        setError(null);
        try {
            await onUpdate(item.id, {
                title,
                price,
                is_listed: isListed
            });
            setIsEditing(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update item';
            setError(errorMessage);
            console.error('Failed to update item:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        
        setIsDeleting(true);
        setError(null);
        try {
            await itemsAPI.deleteItem(item.id);
            onDelete(item.id);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete item';
            setError(errorMessage);
            console.error('Failed to delete item:', error);
            setIsDeleting(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Item title"
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                />
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isListed}
                        onChange={(e) => setIsListed(e.target.checked)}
                        className="mr-2"
                    />
                    <label>Listed for sale</label>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setError(null);
                        }}
                        className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">Price: {formatPrice(item.price)}</p>
                <p className="text-sm text-gray-500">
                    Status: {item.is_listed ? 'Listed for sale' : 'Not listed'}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setError(null);
                        }}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
} 