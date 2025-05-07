import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Redirect to home if authenticated but not admin
    return (
      <div style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#c62828', marginBottom: '20px' }}>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#ff4b5c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return children;
}

export default AdminRoute; 