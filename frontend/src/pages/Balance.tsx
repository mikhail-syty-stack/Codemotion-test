import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

export default function Balance() {
    const { user, updateUser } = useAuth();
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleTransaction = async (type: 'add' | 'withdraw') => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const numAmount = Number(amount);
            if (type === 'withdraw' && numAmount > (user?.balance?.amount || 0)) {
                setError('Insufficient funds');
                return;
            }

            const api = type === 'add' ? authAPI.addFunds : authAPI.withdrawFunds;
            await api(numAmount);
            await updateUser();
            
            setSuccess(`Successfully ${type === 'add' ? 'added' : 'withdrawn'} $${numAmount}`);
            setAmount('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Balance Management</h1>

                {/* Current balance */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="text-center">
                        <h2 className="text-xl text-gray-600 mb-2">Current Balance</h2>
                        <p className="text-4xl font-bold text-blue-600">
                            ${user?.balance?.amount || 0}
                        </p>
                    </div>
                </div>

                {/* Transaction form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">Add or Withdraw Funds</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleTransaction('add')}
                                disabled={isLoading}
                                className={`flex-1 py-2 px-4 rounded ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                } text-white transition-colors duration-200`}
                            >
                                {isLoading ? 'Processing...' : 'Add Funds'}
                            </button>
                            <button
                                onClick={() => handleTransaction('withdraw')}
                                disabled={isLoading}
                                className={`flex-1 py-2 px-4 rounded ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white transition-colors duration-200`}
                            >
                                {isLoading ? 'Processing...' : 'Withdraw Funds'}
                            </button>
                        </div>
                    </div>

                    {/* Transaction history */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Transaction Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Minimum transaction amount is $0.01</li>
                            <li>• You cannot withdraw more than your current balance</li>
                            <li>• Transactions are processed instantly</li>
                            <li>• Keep track of your transaction history in the Offers section</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 