import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { TamaguiProvider } from 'tamagui'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import client from './graphql/client'
import config from './styles/tamagui.config'
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ApolloProvider client={client}>
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TamaguiProvider>
    </ApolloProvider>
  )
}
