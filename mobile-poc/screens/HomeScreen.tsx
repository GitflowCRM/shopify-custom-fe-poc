import React from 'react'
import { FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Text, YStack, XStack, View, Spinner } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@apollo/client'
import { GET_PRODUCTS } from '../graphql/queries/getProducts'
import Header from '../components/Header'
import BannerSlide from '../components/BannerSlide'

interface Product {
  id: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
}

type RootStackParamList = {
  Home: undefined
  Details: { productId: string }
}

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { first: 10 },
  })

  if (loading) return <Spinner size="large" />
  if (error) return <Text color="$red10">Error: {error.message}</Text>

  const products =
    data?.products?.edges?.map((edge: { node: Product }) => edge.node) || []

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { productId: item.id })}
    >
      <XStack
        padding="$2"
        space="$2"
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        <Image
          source={{ uri: item.images.edges[0]?.node.url }}
          style={{ width: 50, height: 50, borderRadius: 5 }}
        />
        <YStack flex={1}>
          <Text fontSize="$5" fontWeight="bold" color="$color">
            {item.title}
          </Text>
          <Text fontSize="$3" numberOfLines={2} color="$color">
            {item.description}
          </Text>
          <Text fontSize="$4" fontWeight="bold" color="$color">
            {item.priceRange.minVariantPrice.amount}{' '}
            {item.priceRange.minVariantPrice.currencyCode}
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  )

  return (
    <View flex={1} backgroundColor="$background">
      <Header />
      <ScrollView>
        <BannerSlide />
        <Text fontSize="$6" fontWeight="bold" padding="$2" color="$color">
          Products
        </Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  )
}
