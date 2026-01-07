import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { API_URL, SOCKET_URL } from '../constants';

export const useSquads = (user) => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLobbies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/lobbies`);
      setLobbies(res.data);
    } catch (err) {
      toast.error("Failed to load squads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbies();
    const socket = io(SOCKET_URL);
    socket.on('lobbies_updated', fetchLobbies); // Re-fetch when socket updates
    return () => socket.disconnect();
  }, []);

  return { lobbies, loading, fetchLobbies, setLobbies };
};