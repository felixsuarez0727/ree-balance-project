const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'input');
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.json'));

function toDate(value) {
  return { "$date": value }; 
}

for (const file of files) {
  const year = path.basename(file, '.json');
  const raw = JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf8'));

  const outputDir = path.join(__dirname, 'output', year);
  fs.mkdirSync(outputDir, { recursive: true });

  const groups = new Map();
  const categories = new Map();
  const values = [];

  for (const item of raw.included) {

    const type = item.type ?? null;

    if (type) {
      groups.set(item.id, {
        _id: item.id,
        type,
        lastUpdate: toDate(item.attributes?.["last-update"])
      });
    }

    for (const sub of item.attributes.content || []) {
      if (!/^\d+$/.test(sub.id)) continue;

      categories.set(sub.id, {
        _id: sub.id,
        type: sub.attributes.title ?? null,
        groupId: sub.groupId,
        color: sub.attributes.color ?? null,
        lastUpdate: toDate(sub.attributes?.["last-update"])
      });

      for (const val of sub.attributes.values || []) {
        values.push({
          categoryId: sub.id,
          datetime: toDate(val.datetime),
          value: val.value,
          percentage: val.percentage
        });
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, 'energyGroups.json'), JSON.stringify(Array.from(groups.values()), null, 2));
  fs.writeFileSync(path.join(outputDir, 'energyCategories.json'), JSON.stringify(Array.from(categories.values()), null, 2));
  fs.writeFileSync(path.join(outputDir, 'energyValues.json'), JSON.stringify(values, null, 2));

  console.log(`✅ Files generated in output/${year}/`);
}
