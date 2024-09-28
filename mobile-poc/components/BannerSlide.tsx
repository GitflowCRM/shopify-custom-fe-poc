import React, { useRef, useEffect } from 'react'
import { Image, Dimensions, ScrollView, View, StyleSheet } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

const banners = [
  {
    id: '1',
    image:
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2022-12/WImported-grocery-banner_WEB.jpg',
  },
  {
    id: '2',
    image:
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/print_crystal_WEB_0.jpg',
  },
  {
    id: '3',
    image:
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/pharmacy-WEB.jpg',
  },
]

export default function BannerSlide() {
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x:
            ((scrollViewRef.current.contentOffset?.x || 0) + screenWidth) %
            (screenWidth * banners.length),
          animated: true,
        })
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      {banners.map((banner) => (
        <View key={banner.id} style={styles.bannerContainer}>
          <Image
            source={{ uri: banner.image }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: screenWidth,
    height: 200,
    borderRadius: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
})
