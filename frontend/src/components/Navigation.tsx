import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navLinkClasses = (path: string) => {
        return `inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
            isActive(path)
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`;
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900">Marketplace</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/my-items"
                                className={navLinkClasses('/my-items')}
                            >
                                My Items
                            </Link>
                            <Link
                                to="/marketplace"
                                className={navLinkClasses('/marketplace')}
                            >
                                Marketplace
                            </Link>
                            <Link
                                to="/offers"
                                className={navLinkClasses('/offers')}
                            >
                                My Offers
                            </Link>
                            <Link
                                to="/transactions"
                                className={navLinkClasses('/transactions')}
                            >
                                Transactions
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        <Link
                            to="/balance"
                            className={navLinkClasses('/balance')}
                        >
                            Balance: ${user?.balance?.amount || 0}
                        </Link>
                        {user?.email && (
                            <span className="text-gray-700 text-sm font-medium">{user.email}</span>
                        )}
                        <button
                            onClick={logout}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/my-items"
                        className={`block px-3 py-2 text-base font-medium ${
                            isActive('/my-items')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        My Items
                    </Link>
                    <Link
                        to="/marketplace"
                        className={`block px-3 py-2 text-base font-medium ${
                            isActive('/marketplace')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        Marketplace
                    </Link>
                    <Link
                        to="/offers"
                        className={`block px-3 py-2 text-base font-medium ${
                            isActive('/offers')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        My Offers
                    </Link>
                    <Link
                        to="/transactions"
                        className={`block px-3 py-2 text-base font-medium ${
                            isActive('/transactions')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        Transactions
                    </Link>
                    <Link
                        to="/balance"
                        className={`block px-3 py-2 text-base font-medium ${
                            isActive('/balance')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        Balance: ${user?.balance?.amount || 0}
                    </Link>
                    {user?.email && (
                        <div className="block px-3 py-2 text-base font-medium text-gray-700">{user.email}</div>
                    )}
                    <button
                        onClick={logout}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
} 