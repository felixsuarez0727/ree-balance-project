import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type EnergyGroup {
    id: String!
    type: String!
    lastUpdate: String!
    categories: [EnergyCategory]
  }

  type EnergyCategory {
    id: String!
    type: String!
    groupId: String!
    color: String!
    lastUpdate: String!
    values: [EnergyValue]
  }

  type EnergyValue {
    categoryId: String!
    datetime: String!
    value: Float!
    percentage: Float
  }

  type Query {
    energyGroups: [EnergyGroup!]!
    energyGroup(id: String!): EnergyGroup
    energyCategories: [EnergyCategory!]!
    energyCategory(id: String!): EnergyCategory
    categoriesByGroup(groupId: String!): [EnergyCategory]
    energyValues: [EnergyValue!]!
    valuesByCategory(categoryId: String!, from: String, to: String): [EnergyValue]
    valuesByGroup(groupId: String!, from: String, to: String): [EnergyValue]
  }


`;
