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
}

interface Transaction {
    id: number;
    item: Item;
    buyer: User;
    seller: User;
    amount: number;
    created_at: string;
}

interface TransactionCardProps {
    transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
    const { user } = useAuth();
    const isBuyer = user?.id === transaction.buyer.id;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
                <img
                    src={transaction.item.image_url}
                    alt={transaction.item.title}
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{transaction.item.title}</h3>
                    <p className="text-blue-600 font-medium">
                        Price: {formatPrice(transaction.amount)}
                    </p>
                    <div className="mt-2 text-sm">
                        {isBuyer ? (
                            <p>Bought from: {transaction.seller.email}</p>
                        ) : (
                            <p>Sold to: {transaction.buyer.email}</p>
                        )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                        {new Date(transaction.created_at).toLocaleTimeString()}
                    </div>
                    <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {isBuyer ? 'Purchased' : 'Sold'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
} 