import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import MyItems from './pages/MyItems';
import Marketplace from './pages/Marketplace';
import Offers from './pages/Offers';
import Balance from './pages/Balance';
import Transactions from './pages/Transactions';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <MyItems />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <Marketplace />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <Offers />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/balance"
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <Balance />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <Transactions />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/my-items" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
