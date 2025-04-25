import { IResolvers } from '@graphql-tools/utils';
import { Db } from 'mongodb';
import EnergyGroup from './models/EnergyGroup';
import EnergyCategory from './models/EnergyCategory';
import EnergyValue from './models/EnergyValue';

interface Context {
  db: Db;
}

function formatDocumentForGraphQL(doc: any) {
  if (!doc) return null;
  const result = {
    ...doc.toObject ? doc.toObject() : doc,
    id: doc._id ? doc._id.toString() : null
  };
  
  // Formatear las fechas
  if (result.lastUpdate instanceof Date) {
    result.lastUpdate = result.lastUpdate.toISOString();
  }
  if (result.datetime instanceof Date) {
    result.datetime = result.datetime.toISOString();
  }
  
  return result;
}

export const resolvers: IResolvers<any, Context> = {
  Query: {
    energyGroups: async () => {
      const groups = await EnergyGroup.find().lean();
      return groups.map(formatDocumentForGraphQL);
    },
    energyGroup: async (_: any, { id }: { id: string }) => {
      const group = await EnergyGroup.findOne({ _id: id }).lean();
      return formatDocumentForGraphQL(group);
    },
    energyCategories: async () => {
      const categories = await EnergyCategory.find().lean();
      return categories.map(formatDocumentForGraphQL);
    },
    energyCategory: async (_: any, { id }: { id: string }) => {
      const category = await EnergyCategory.findOne({ _id: id }).lean();
      return formatDocumentForGraphQL(category);
    },
    categoriesByGroup: async (_: any, { groupId }: { groupId: string }) => {
      const categories = await EnergyCategory.find({ groupId }).lean();
      return categories.map(formatDocumentForGraphQL);
    },
    energyValues: async () => {
      const values = await EnergyValue.find().lean();
      return values.map(formatDocumentForGraphQL);
    },
    valuesByCategory: async (_: any, { categoryId, from, to }: { categoryId: string, from?: string, to?: string }) => {
      const filter: any = { categoryId };
      if (from || to) {
        filter.datetime = {};
        if (from) filter.datetime.$gte = new Date(from);
        if (to) filter.datetime.$lte = new Date(to);
      }
      const values = await EnergyValue.find(filter).sort({ datetime: 1 }).lean();
      return values.map(formatDocumentForGraphQL);
    },
    valuesByGroup: async (_: any, { groupId, from, to }: { groupId: string, from?: string, to?: string }) => {
      const dateFilter: any = {};
      if (from) dateFilter.$gte = new Date(from);
      if (to) dateFilter.$lte = new Date(to);

      const results = await EnergyCategory.aggregate([
        { $match: { groupId } },
        {
          $lookup: {
            from: 'energyValues',
            let: { categoryId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$categoryId', '$$categoryId'] } } },
              ...(from || to ? [{ $match: { datetime: dateFilter } }] : []),
              { $sort: { datetime: 1 } }
            ],
            as: 'values'
          }
        },
        { $unwind: '$values' },
        { $replaceRoot: { newRoot: '$values' } }
      ]);
      
      return results.map(formatDocumentForGraphQL);
    }
  },

  EnergyGroup: {
    categories: async (parent, _, { db }) => {
      const categories = await EnergyCategory.find({ groupId: parent.id || parent._id }).lean();
      return categories.map(formatDocumentForGraphQL);
    }
  },

  EnergyCategory: {
    values: async (parent, _, { db }) => {
      const values = await EnergyValue.find({ categoryId: parent.id || parent._id }).sort({ datetime: 1 }).lean();
      return values.map(formatDocumentForGraphQL);
    }
  }
};