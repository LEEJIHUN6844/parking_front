import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // App load: check for user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  // This context will be passed down to child routes (Main, Mypage, etc.)
  // It allows them to access user data or trigger login.
  const context = {
    user,
    // A function for login pages to call on success
    handleLoginSuccess: (loggedInUser) => {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      alert(`환영합니다, ${loggedInUser.name}님!`);
      navigate('/');
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="pt-16"> {/* Add padding-top to avoid content being hidden by fixed navbar */}
        <Outlet context={context} />
      </main>
    </>
  );
}
