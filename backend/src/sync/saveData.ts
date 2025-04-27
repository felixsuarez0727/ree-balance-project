import EnergyGroup from '../graphql/models/EnergyGroup';
import EnergyCategory from '../graphql/models/EnergyCategory';
import EnergyValue from '../graphql/models/EnergyValue';

export async function saveData(data: any) {
  const groups = new Map();
  const categories = new Map();
  const values: any[] = [];

  for (const item of data.included) {
    const type = item.type ?? null;

    if (type) {
      groups.set(item.id, {
        _id: item.id,
        type,
        lastUpdate: new Date(item.attributes?.["last-update"])
      });
    }

    for (const sub of item.attributes.content || []) {
      if (!/^\d+$/.test(sub.id)) continue;

      categories.set(sub.id, {
        _id: sub.id,
        type: sub.attributes.title ?? null,
        groupId: sub.groupId,
        color: sub.attributes.color ?? null,
        lastUpdate: new Date(sub.attributes?.["last-update"])
      });

      for (const val of sub.attributes.values || []) {
        values.push({
          categoryId: sub.id,
          datetime: new Date(val.datetime),
          value: parseFloat(val.value),
          percentage: parseFloat(val.percentage)
        });
      }
    }
  }

  await Promise.all([
    ...Array.from(groups.values()).map(group =>
      EnergyGroup.updateOne(
        { _id: group._id }, 
        { $set: group },  
        { upsert: true }   
      )
    ),
    ...Array.from(categories.values()).map(category =>
      EnergyCategory.updateOne(
        { _id: category._id }, 
        { $set: category },  
        { upsert: true }   
      )
    ),
    ...values.map(value =>
      EnergyValue.updateOne(
        { categoryId: value.categoryId, datetime: value.datetime },
        { $set: value },      
        { upsert: true }     
      )
    )
  ]);

  console.log('✅ Data saved or updated in MongoDB');
}
