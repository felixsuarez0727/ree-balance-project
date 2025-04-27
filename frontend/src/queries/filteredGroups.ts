import { gql } from "@apollo/client";

const GET_GROUPED_DATA = gql`
query ($groupIds: [String!]!, $from: String, $to: String) {
  valuesByGroup(groupIds: $groupIds, from: $from, to: $to) {
    group {
      id
      type
      totalPercentage
      totalValue
    }

    categories {
      category {
        type
        totalPercentage
        totalValue
      }
      values {
        value
        percentage
        datetime
      }
    }
  }
}`

export default GET_GROUPED_DATA