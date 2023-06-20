import React, { 
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode
} from 'react';

import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

// auth context definition
interface AuthContextType {
  user: User | null;
  session: Session | null;
};

// create a context for authentication
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const updateSession = (session: Session | null) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        setLoading(false);
      }
    };

    async function getSession() {
      supabase.auth.getSession().then(
        ({ data: { session }}) => updateSession(session)
      );
      
      const { data: { subscription }} = supabase.auth.onAuthStateChange(
        (_event, session) => {
          updateSession(session);
        }
      );

      return () => {
        subscription?.unsubscribe();
      }
    }
    getSession();
  }, []);
  
  // auth functionality is provided by context
  const value = { user, session };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
