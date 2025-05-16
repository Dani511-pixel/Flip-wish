import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type
type User = {
  id: number;
  username: string;
  name: string;
  email: string;
} | null;

// Define the auth context type
type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: false,
});

// Export the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication functions
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser({
      id: 1,
      username,
      name: "Demo User",
      email: "user@example.com"
    });
    setIsLoading(false);
  };
  
  const register = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser({
      id: 1,
      username: data.username,
      name: data.name,
      email: data.email
    });
    setIsLoading(false);
  };
  
  const logout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setIsLoading(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};