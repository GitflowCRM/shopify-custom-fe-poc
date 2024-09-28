import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { H1, TamaguiProvider, Text, View } from 'tamagui'
import { useFonts } from 'expo-font'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import client from '../graphql/client'
import config from '@/styles/tamagui.config'
import { Button } from 'react-native'
import { Colors } from '@/constants/Colors'

const HomeScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <H1>Heading 1</H1>
      <Button
        onPress={() => navigation.navigate('Details')}
        title="Go to Details"
      />
    </View>
  )
}

const Stack = createNativeStackNavigator()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({})

  if (!fontsLoaded) {
    return null // or a loading screen
  }

  return (
    <ApolloProvider client={client}>
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TamaguiProvider>
    </ApolloProvider>
  )
}
