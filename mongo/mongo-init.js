db = db.getSiblingDB("ree-balance");

db.createCollection("energyGroups", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "type"],
      properties: {
        _id: { bsonType: "string" },
        type: { bsonType: "string" },
        lastUpdate: { bsonType: "date" },
      },
    },
  },
});

db.createCollection("energyCategories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "type", "groupId"],
      properties: {
        _id: { bsonType: "string" },
        type: { bsonType: "string" },
        groupId: { bsonType: "string" },
        color: { bsonType: "string" },
        lastUpdate: { bsonType: "date" },
      },
    },
  },
});

db.createCollection("energyValues", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["categoryId", "datetime", "value"],
      properties: {
        categoryId: { bsonType: "string" },
        datetime: { bsonType: "date" },
        value: { bsonType: "double" },
        percentage: { bsonType: "double" },
      },
    },
  },
});


db.energyGroups.createIndex({ "type": 1 });  
db.energyGroups.createIndex({ "lastUpdate": -1 }); 

db.energyCategories.createIndex({ "groupId": 1 }); 
db.energyCategories.createIndex({ "type": 1 });  
db.energyCategories.createIndex({ "lastUpdate": -1 });  

db.energyValues.createIndex({ "categoryId": 1, "datetime": 1 }); 
db.energyValues.createIndex({ "datetime": 1 }); 

db.energyValues.createIndex({ "categoryId": 1, "datetime": 1, "value": 1 });
db.energyValues.createIndex({ "datetime": 1, "value": -1 }); 

console.log("Database initialization completed");
