import { gql } from "@apollo/client";

const ALL_ENERGY_GROUPS = gql`
  query GetEnergyGroups {
    energyGroups {
      id
      type
    }
  }
`;

export default ALL_ENERGY_GROUPS;
