import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (pin: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'ramys_studio_admin_auth_v1';
const VALID_PINS = ['ramy2026', '1234', 'admin123', 'admin'];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (pin: string): { success: boolean; error?: string } => {
    const cleanPin = pin.trim().toLowerCase();
    if (VALID_PINS.includes(cleanPin)) {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch (err) {
        console.error('Storage error:', err);
      }
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Galat Admin Passcode. Kripya sahi passcode enter karein.' };
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
