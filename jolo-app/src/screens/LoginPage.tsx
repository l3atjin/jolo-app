import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import Account from '../components/Account'
import { Pressable, View, Text } from 'react-native'
import { useAuth } from '../contexts/Auth'

export default function LoginPage( {navigation} ) {
  const { user, session } = useAuth();

  const onPressHandler = () => {
    navigation.navigate('LensPage')
  }

  console.log("in Login Page")
  return (
    <View>
      {session && user ? <Account key={user.id} /> : <LoginForm />}
      <Pressable onPress={onPressHandler}>
        <Text>Go to Search Page</Text>
      </Pressable>
    </View>
  )
}
