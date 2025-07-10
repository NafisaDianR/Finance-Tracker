'use client';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  if (users) return JSON.parse(users);
  
  const adminUser: User = { id: 'admin', name: 'Admin User', email: 'admin@example.com', password: 'admin', isAdmin: true };
  localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  return [adminUser];
};

const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function useAuth() {
  const router = useRouter();

  const signup = (name: string, email: string, password: string): User | null => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      alert('User with this email already exists.');
      return null;
    }
    const newUser: User = { id: crypto.randomUUID(), name, email, password, isAdmin: false };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  };

  const login = (email: string, password: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }
      return user;
    }
    alert('Invalid email or password.');
    return null;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    router.push('/login');
  };

  const getCurrentUser = useCallback((): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }, []);
  
  const updateUser = useCallback((userId: string, data: Partial<Omit<User, 'id' | 'isAdmin'>>) => {
    if (typeof window === 'undefined') return null;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        alert("User not found.");
        return null;
    }

    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;
    saveUsers(users);

    const currentUser = getCurrentUser();
    if(currentUser && currentUser.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  }, [getCurrentUser]);

  return { signup, login, logout, getCurrentUser, getUsers, saveUsers, updateUser };
}

export function useRequireAuth(redirectTo = '/login') {
    const { getCurrentUser } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push(redirectTo);
        } else {
            setUser(currentUser);
        }
    }, [router, redirectTo, getCurrentUser]);

    return user;
}

export function useRequireAdmin(redirectTo = '/') {
    const user = useRequireAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !user.isAdmin) {
            alert('Access denied. Admins only.');
            router.push(redirectTo);
        }
    }, [user, router, redirectTo]);

    return user;
}
