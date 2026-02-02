import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../constants';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('clanforge_user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('clanforge_user', JSON.stringify(userData));
    toast.success(`Welcome, ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('clanforge_user');
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (updatedData) => {
    try {
      await axios.post(`${API_URL}/users`, updatedData);
      setUser(updatedData);
      localStorage.setItem('clanforge_user', JSON.stringify(updatedData));
      toast.success("Profile updated!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      await axios.delete(`${API_URL}/users/${user.uid}`);
      logout();
      toast.success("Account deleted successfully");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
      return false;
    }
  };

  return { user, login, logout, updateProfile, deleteAccount };
};