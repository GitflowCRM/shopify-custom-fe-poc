import React from 'react'
import { View, Button } from 'react-native'
import { Text } from 'tamagui'
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  )
}
