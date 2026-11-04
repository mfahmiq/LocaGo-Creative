import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isOwner: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOwnerPin: (pin: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('locago_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Sync state with Supabase Auth Session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email || '';
          const metaRole = session.user.user_metadata?.role;
          const isOwnerUser = email.toLowerCase() === 'fahmi@locagocreative.my.id' || metaRole === 'owner';
          const profile: UserProfile = {
            id: session.user.id,
            email: email,
            name: session.user.user_metadata?.full_name || email.split('@')[0],
            role: isOwnerUser ? 'owner' : 'member',
            isOwner: isOwnerUser
          };
          setUser(profile);
          localStorage.setItem('locago_auth_user', JSON.stringify(profile));
        }
      } catch (err) {
        console.warn('Auth session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const metaRole = session.user.user_metadata?.role;
        const isOwnerUser = email.toLowerCase() === 'fahmi@locagocreative.my.id' || metaRole === 'owner';
        const profile: UserProfile = {
          id: session.user.id,
          email: email,
          name: session.user.user_metadata?.full_name || email.split('@')[0],
          role: isOwnerUser ? 'owner' : 'member',
          isOwner: isOwnerUser
        };
        setUser(profile);
        localStorage.setItem('locago_auth_user', JSON.stringify(profile));
      } else {
        // If not in Supabase session, check if PIN-based owner mode is active
        const saved = localStorage.getItem('locago_auth_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isOwner && parsed.role === 'owner') {
              setUser(parsed);
              return;
            }
          } catch {}
        }
        setUser(null);
        localStorage.removeItem('locago_auth_user');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login with Email & Password via Supabase Auth
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userEmail = data.user.email || '';
        const isOwnerUser = userEmail.toLowerCase() === 'fahmi@locagocreative.my.id' || data.user.user_metadata?.role === 'owner';
        const profile: UserProfile = {
          id: data.user.id,
          email: userEmail,
          name: data.user.user_metadata?.full_name || userEmail.split('@')[0],
          role: isOwnerUser ? 'owner' : 'member',
          isOwner: isOwnerUser
        };
        setUser(profile);
        localStorage.setItem('locago_auth_user', JSON.stringify(profile));
        return { success: true };
      }

      return { success: false, error: 'Login gagal. Periksa email dan password Anda.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Terjadi kesalahan sistem auth.' };
    }
  };

  // Register with Email & Password via Supabase Auth
  const registerWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            full_name: name.trim(),
            role: 'member'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If user session immediately returned
      if (data.session && data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: name.trim(),
          role: 'member',
          isOwner: false
        };
        setUser(profile);
        localStorage.setItem('locago_auth_user', JSON.stringify(profile));
        return { success: true };
      }

      // If auto-confirm is triggered or user created
      if (data.user) {
        // Try immediately signing in
        const signInRes = await loginWithEmail(email, pass);
        if (signInRes.success) return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registrasi gagal.' };
    }
  };

  // Instant Owner PIN bypass for Mas Fahmi's convenience
  const loginWithOwnerPin = (pin: string): boolean => {
    const valid = ['fahmi', 'locago', 'locago2026', 'fahmi2026', 'master', '0411'].includes(pin.trim().toLowerCase());
    if (valid) {
      const ownerProfile: UserProfile = {
        id: '995f91f5-8803-4b58-b501-0b4076c678fb',
        email: 'fahmi@locagocreative.my.id',
        name: 'Mas Fahmi (Founder & Owner)',
        role: 'owner',
        isOwner: true
      };
      setUser(ownerProfile);
      localStorage.setItem('locago_auth_user', JSON.stringify(ownerProfile));
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem('locago_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOwner: user?.isOwner ?? false,
        isLoggedIn: user !== null,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        registerWithEmail,
        loginWithOwnerPin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
