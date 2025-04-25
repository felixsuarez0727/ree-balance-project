import { gql } from "@apollo/client";

const GET_COMPLETE_HIERARCHY = gql`
  query CompleteHierarchy {
    energyGroups {
      id
      type
      lastUpdate
      categories {
        id
        type
        color
        lastUpdate
        values {
          datetime
          value
          percentage
        }
      }
    }
  }
`;

export default GET_COMPLETE_HIERARCHY