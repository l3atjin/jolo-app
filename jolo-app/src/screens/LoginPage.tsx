import React, { useEffect, useState } from 'react'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { Pressable, View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../api/supabase'

export default function LoginPage( {navigation} ) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const onPressHandler = () => {
    navigation.navigate('LensPage')
  }

  console.log("in Login Page")
  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
      <Pressable onPress={onPressHandler}>
        <Text>Go to Search Page</Text>
      </Pressable>
    </View>
  )
}
