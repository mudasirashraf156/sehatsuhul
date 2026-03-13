import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const KEY = 'ss_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    }
    setLoading(false);
  }, []);

  const setAuth = (data) => {
    setUser(data);
    localStorage.setItem(KEY, JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const login = async (email, password, role) => {
    const { data } = await axios.post('/api/auth/login', { email, password, role });
    setAuth(data); return data;
  };

  const register = async (form) => {
    const { data } = await axios.post('/api/auth/register', form);
    setAuth(data); return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (data) => setAuth({ ...user, ...data });

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
