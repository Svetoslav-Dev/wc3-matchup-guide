import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthUser } from "@warcraft3-guide-hub/shared";
import { mobileApi } from "./api";

const AUTH_TOKEN_STORAGE_KEY = "wc3_mobile_auth_token";

type AuthContextValue = {
  apiReady: boolean;
  initializing: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const apiReady = mobileApi.configReady();

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!apiReady) {
        if (!cancelled) {
          setInitializing(false);
        }

        return;
      }

      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

        if (!storedToken) {
          if (!cancelled) {
            setInitializing(false);
          }

          return;
        }

        const response = await mobileApi.getCurrentUser(storedToken);

        if (!cancelled) {
          setToken(storedToken);
          setUser(response.data);
        }
      } catch {
        await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [apiReady]);

  const value = useMemo<AuthContextValue>(
    () => ({
      apiReady,
      initializing,
      user,
      token,
      login: async (input) => {
        const response = await mobileApi.login(input);
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
        setToken(response.token);
        setUser(response.data);
      },
      register: async (input) => {
        const response = await mobileApi.register(input);
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
        setToken(response.token);
        setUser(response.data);
      },
      logout: () => {
        void AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [apiReady, initializing, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
