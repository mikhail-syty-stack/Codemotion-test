import { useState } from 'react';
import { authAPI } from '../services/api';

interface BalanceManagerProps {
    currentBalance: number;
    onBalanceUpdate: () => void;
}

export default function BalanceManager({ currentBalance, onBalanceUpdate }: BalanceManagerProps) {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddingFunds, setIsAddingFunds] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            setIsProcessing(true);
            if (isAddingFunds) {
                await authAPI.addFunds(Number(amount));
            } else {
                await authAPI.withdrawFunds(Number(amount));
            }
            setAmount('');
            onBalanceUpdate();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Balance</h2>
                <span className="text-2xl font-bold text-green-600">${currentBalance}</span>
            </div>

            <div className="mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsAddingFunds(true)}
                        className={`flex-1 py-2 px-4 rounded-lg ${
                            isAddingFunds
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Add Funds
                    </button>
                    <button
                        onClick={() => setIsAddingFunds(false)}
                        className={`flex-1 py-2 px-4 rounded-lg ${
                            !isAddingFunds
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter amount"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isProcessing
                        ? 'Processing...'
                        : isAddingFunds
                        ? 'Add Funds'
                        : 'Withdraw Funds'}
                </button>
            </form>
        </div>
    );
} 