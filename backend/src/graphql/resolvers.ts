import { IResolvers } from "@graphql-tools/utils";
import { Db } from "mongodb";
import EnergyGroup from "./models/EnergyGroup";
import EnergyCategory from "./models/EnergyCategory";
import EnergyValue from "./models/EnergyValue";

interface Context {
  db: Db;
}

function formatDocumentForGraphQL(doc: any) {
  if (!doc) return null;
  const result = {
    ...(doc.toObject ? doc.toObject() : doc),
    id: doc._id ? doc._id.toString() : null,
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
    valuesByCategory: async (
      _: any,
      {
        categoryId,
        from,
        to,
      }: { categoryId: string; from?: string; to?: string }
    ) => {
      const filter: any = { categoryId };
      if (from || to) {
        filter.datetime = {};
        if (from) filter.datetime.$gte = new Date(from);
        if (to) filter.datetime.$lte = new Date(to);
      }
      const values = await EnergyValue.find(filter)
        .sort({ datetime: 1 })
        .lean();
      return values.map(formatDocumentForGraphQL);
    },
    valuesByGroup: async (
      _: any,
      args: { groupIds: string[]; from?: string; to?: string }
    ) => {
      const dateFilter: any = {};
      if (args.from) dateFilter.$gte = new Date(args.from);
      if (args.to) dateFilter.$lte = new Date(args.to);
   
      const groups = await EnergyGroup.find({ _id: { $in: args.groupIds } });

      if (!groups.length) return [];

      return await Promise.all(
        groups.map(async (group) => {
          const categories = await EnergyCategory.aggregate([
            { $match: { groupId: group._id } },
            {
              $lookup: {
                from: "energyValues",
                let: { categoryId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$categoryId", "$$categoryId"] },
                      ...(args.from || args.to ? { datetime: dateFilter } : {}),
                    },
                  },

                  { $sort: { datetime: 1 } },
                ],
                as: "values",
              },
            },
            {
              $addFields: {
                totalValue: { $sum: "$values.value" },
                totalPercentage: { $sum: "$values.percentage" },
              },
            },
          ]);

          const { totalValue, totalPercentage } = categories.reduce(
            (acc, item) => {
              acc.totalPercentage += item.totalPercentage;
              acc.totalValue += item.totalValue;
              return acc;
            },
            { totalPercentage: 0, totalValue: 0 }
          );

          return {
            group: {
              id: group._id,
              type: group.type,
              lastUpdate: group.lastUpdate,
              totalValue,
              totalPercentage,
            },
            categories: categories.map(({ values, ...rest }) => ({
              category: rest,
              values: values.map((v: any) => ({
                ...v,
                datetime: v.datetime ? new Date(v.datetime).toISOString() : null,
              })),
            })),
          };
        })
      );
    },
  },

  EnergyGroup: {
    categories: async (parent, args: { from?: string; to?: string }) => {
      const matchStage: any = { groupId: parent.id || parent._id };

      const dateFilter: any = {};
      if (args.from) dateFilter.$gte = new Date(args.from);
      if (args.to) dateFilter.$lte = new Date(args.to);

      const pipeline: any[] = [
        { $match: matchStage },
        {
          $lookup: {
            from: "energyValues",
            let: { categoryId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$categoryId", "$$categoryId"] } } },
              ...(args.from || args.to
                ? [{ $match: { datetime: dateFilter } }]
                : []),
              { $sort: { datetime: 1 } },
            ],
            as: "values",
          },
        },
      ];

      const categories = await EnergyCategory.aggregate(pipeline);
      return categories.map(formatDocumentForGraphQL);
    },
  },

  EnergyCategory: {
    values: async (parent, args: { from?: string; to?: string }, { db }) => {
      const filter: any = {
        categoryId: parent.id || parent._id,
      };

      if (args.from || args.to) {
        filter.datetime = {};
        if (args.from) filter.datetime.$gte = new Date(args.from);
        if (args.to) filter.datetime.$lte = new Date(args.to);
      }

      const values = await EnergyValue.find(filter)
        .sort({ datetime: 1 })
        .lean();
      return values.map(formatDocumentForGraphQL);
    },
  },
};
