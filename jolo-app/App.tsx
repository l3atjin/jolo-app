import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/api/supabase'
import { Session } from '@supabase/supabase-js'
import { NavigationContainer } from '@react-navigation/native'
import LoginPage from './src/screens/LoginPage'

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
    <NavigationContainer>
      <LoginPage></LoginPage>
    </NavigationContainer>
    
  )
}