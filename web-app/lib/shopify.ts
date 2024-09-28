import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: '2024-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export interface Product {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: {
      node: {
        url: string;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
}

export async function fetchProducts(limit = 10): Promise<Product[]> {
  const query = `
    query GetProducts($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.request(query, { variables: { limit } });
    return data?.products?.edges?.map((edge: { node: Product }) => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      featuredImage: {
        url: string;
      } | null;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: CartItem;
    }[];
  };
}

export async function createCart(): Promise<Cart> {
  const mutation = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(mutation);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(mutation, {
    variables: {
      cartId,
      lines: [{ quantity, merchandiseId: variantId }],
    },
  });

  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first : 10) {
        edges {
          node {
            id
            quantity
            merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                title
                featuredImage {
                  url
                }
              }
            }
          }
          }
        }
        }
      }
    }
  `;

  try {
    const { data } = await client.request(query, {
      variables: { cartId },
    });

    return data?.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(mutation, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  return data.cartLinesUpdate.cart;
}

export async function removeCartItem(cartId: string, lineId: string): Promise<Cart> {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(mutation, {
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });

  return data.cartLinesRemove.cart;
}