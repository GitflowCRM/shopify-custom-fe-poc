import React from 'react';
import { FlatList } from 'react-native';
import { Card, H2, Paragraph, Image, YStack } from 'tamagui';

interface Product {
  id: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const renderProduct = ({ item }: { item: Product }) => (
    <Card key={item?.id} elevate size="$4" bordered margin="$2">
      <Card.Header>
        <H2>{item?.title}</H2>
      </Card.Header>
      <Image
        source={{ uri: item?.images?.edges[0]?.node?.url }}
        alt={item?.images?.edges[0]?.node?.altText || item?.title}
        width={200}
        height={200}
        resizeMode="cover"
      />
      <Card.Footer>
        <YStack>
          <Paragraph>{item?.description}</Paragraph>
          <Paragraph>
            Price: {item?.priceRange?.minVariantPrice?.amount} {item?.priceRange?.minVariantPrice?.currencyCode}
          </Paragraph>
        </YStack>
      </Card.Footer>
    </Card>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item?.id}
    />
  );
}