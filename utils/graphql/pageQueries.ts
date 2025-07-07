import { gql } from "apps/utils/graphql.ts";

const Product = gql`
  fragment Product on Product {
    mainVariant
    productName
    productId
    alias
    attributes {
      value
      name
    }
    productCategories {
      id
      name
      url
      hierarchy
      main
      googleCategories
    }
    informations {
      title
      value
      type
    }
    available
    averageRating
    condition
    createdAt
    ean
    id
    images {
      url
      fileName
      print
    }
    minimumOrderQuantity
    prices {
      bestInstallment {
        discount
        displayName
        fees
        name
        number
        value
      }
      discountPercentage
      discounted
      installmentPlans {
        displayName
        installments {
          discount
          fees
          number
          value
        }
        name
      }
      listPrice
      multiplicationFactor
      price
      priceTables {
        discountPercentage
        id
        listPrice
        price
      }
      wholesalePrices {
        price
        quantity
      }
    }
    productBrand {
      fullUrlLogo
      logoUrl
      name
      alias
    }
    productVariantId
    seller {
      name
    }
    parentId
    sku
    numberOfVotes
    stock
    variantName
    variantStock
    collection
    urlVideo
    similarProducts {
      alias
      image
      imageUrl
      name
    }
    promotions {
      content
      disclosureType
      id
      fullStampUrl
      stamp
      title
    }
    buyBox {
      maximumPrice
      minimumPrice
      quantityOffers
      installmentPlans {
        displayName
        installments {
          discount
          fees
          number
          totalValue
          value
        }
      }
    }
    spotInformation
    # parallelOptions
  }
`;

export const Home = {
  fragments: [Product],
  query: gql`
    query Home(
      $sortDirection: SortDirection!
      $sortKey: ProductSortKeys
      $first: Int
    ) {
      anticoagulante: products(
        filters: { categoryId: 15439, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      colageno: products(
        filters: { categoryId: 14887, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      descongestionanteNasal: products(
        filters: { categoryId: 14975, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      diabetes: products(
        filters: { categoryId: 15436, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      disfuncaoEretil: products(
        filters: { categoryId: 15585, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      leiteInfantil: products(
        filters: { categoryId: 15219, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      medicamentosAltoCusto: products(
        filters: { categoryId: 15504, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      pararDeFumar: products(
        filters: { categoryId: 15080, available: true }
        first: $first
        sortDirection: $sortDirection
        sortKey: $sortKey
      ) {
        nodes {
          ...Product
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  `,
};
