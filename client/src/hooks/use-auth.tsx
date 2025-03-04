import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { InsertUser } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useLocation } from 'wouter';

interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loginMutation: UseMutationResult<any, unknown, { username: string; password: string }, unknown>;
  registerMutation: UseMutationResult<any, unknown, InsertUser, unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Fetch user data from API or local storage
    const fetchUser = async () => {
      // Example user data
      const userData = { id: 1, name: 'Admin', isAdmin: true };
      setUser(userData);
    };

    fetchUser();
  }, []);

  const loginMutation = useMutation<LoginResponse, unknown, LoginData>({
    mutationFn: async (data: LoginData) => {
      // Perform the login request
      const response = await apiRequest('POST', '/login', data);
      const userData: LoginResponse = await response.json(); // Parse the response to get user data
      return userData; // Assuming the response contains user data
    },
    onSuccess: (data: LoginResponse) => {
      setUser(data); // Set user based on response
      toast({ title: "Login successful!", description: "Welcome back!" });
      setLocation('/'); // Redirect to home page after successful login
    },
    onError: () => {
      toast({ title: "Login failed!", description: "Please check your credentials." });
    },
  });

  const registerMutation = useMutation<unknown, unknown, InsertUser>({
    mutationFn: async (data: InsertUser) => {
      // Perform the registration request
      const response = await apiRequest('POST', '/register', data);
      return response.json(); // Assuming the response contains user data
    },
    onSuccess: () => {
      toast({ title: "Registration successful!", description: "You can now log in." });
    },
    onError: () => {
      toast({ title: "Registration failed!", description: "Please try again." });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = () => {
    // Perform logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginMutation, registerMutation }}>
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
