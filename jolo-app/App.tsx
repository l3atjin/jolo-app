import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/api/supabase'
import { Session } from '@supabase/supabase-js'
import RootNavigator from './src/navigations/RootNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/contexts/Auth';

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator/>
      </AuthProvider>
    </SafeAreaProvider>
    
  )
}