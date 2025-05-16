// A simplified auth hook for the demo
export function useAuth() {
  return {
    user: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    isLoading: false,
    isAuthenticated: false
  };
}

// Export dummy AuthProvider
export const AuthProvider = ({ children }: any) => children;