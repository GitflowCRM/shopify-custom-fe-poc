import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { XStack, Input, Text, View } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <View backgroundColor="$background" padding="$2">
      <XStack alignItems="center" space="$2">
        <Input
          flex={1}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          placeholderTextColor="$color"
          backgroundColor="$backgroundHover"
          color="$color"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="$color" />
        </TouchableOpacity>
      </XStack>
    </View>
  )
}