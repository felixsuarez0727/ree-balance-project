# REE Electric Balance API & Dashboard

This project is a full-stack application that fetches real-time data from the Spanish Electric Grid (REE - Red Eléctrica de España), stores it in MongoDB, and provides both a GraphQL API and a React dashboard to visualize the electric balance.

## 🧰 Tech Stack

### Backend

- Node.js with Express
- GraphQL
- MongoDB for data storage
- TypeScript
- Docker containerization

### Frontend

- React
- Apollo Client
- Recharts for data visualization
- TypeScript
- Styled with TailwindCSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose

### Running with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# To stop all services
docker-compose down
```

Once started:

- Backend API will be available at: http://localhost:4000/graphql
- Frontend will be available at: http://localhost:3000
- Mongo will be available: mongodb://root:rootpassword@localhost:27017/

**First Run Warning:** The first time you run the system, the initial synchronization (Prefetch) will load historical data from 2024 until the current date. This process may take between 1 to 2 minutes, so please be patient during this time.

### Running Locally

#### Env

You need to create the following environment files:

**Frontend** `.env` (in root of frontend directory)

```bash
VITE_GRAPHQL_API_URL=http://localhost:4000/graphql
```

**Backend** `.env` (in root of backend directory)

```bash
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://root:rootpassword@localhost:27017/?authSource=admin&dbName=ree-balance
REE_URI=https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date={start}&end_date={end}&time_trunc=day
```

Before running, you need to start the MongoDB container

#### Mongo

```bash
docker-compose up mongo
```

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

```

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

```

## 📊 Data Pipeline

1. **Data Collection**: The system periodically fetches data from the REE API.
   - **Prefetched Sync**: The first time the system runs, it loads pre-fetched data from the year 2024.
   - **Initial Sync**: The system fetches data starting from the beginning of 2025 until the current date during the first complete sync.
   - **Scheduled Daily Sync**: Every day, the system fetches the latest data and updates the MongoDB database.
2. **Data Processing**: Raw data is processed and normalized into our schema.
3. **Storage**: Processed data is stored in MongoDB collections.
4. **API Layer**: GraphQL API provides access to stored data with advanced filtering.
5. **Visualization**: React frontend consumes the GraphQL API to display interactive charts.

## 💾 Data Model

The system uses four main collections:

1. **energyGroups**: Represents different energy types

   ```typescript
   {
     id: string;
     type: string;
     lastUpdate: date;
   }
   ```

2. **energyValues**: Contains actual measurements

   ```typescript
   {
     id: string;
     categoryId: string;
     datetime: Date;
     value: number;
     percentage: number;
   }
   ```

3. **energyCategories**: Classifies energy groups

   ```typescript
   {
     id: string;
     type: string;
     groupId: string;
     lastUpdate: date;
   }
   ```

4. **syncLog**: Stores synchronization logs
   ```typescript
   {
     _id: string;
     status: string;
     timestamp: Date;
   }
   ```

## 🔄 Data Updates

The system automatically refreshes data from the REE API on a scheduled basis.

- **Prefetched Sync**: On the first run, the system loads pre-fetched data from the year 2024 to populate the database with historical data for that year.
- **Initial Sync**: The first time the system fully synchronizes, it fetches data starting from the beginning of 2025 until the current date.
- **Scheduled Daily Sync**: After the initial sync, the system synchronizes new data every day, fetching the latest available data and updating the MongoDB database. If the system has already been synced on the current day, the sync will be skipped to avoid duplication.

## 📡 GraphQL API

### Example Queries

#### Get Energy Groups

```graphql
query GetEnergyGroups {
  energyGroups {
    id
    type
  }
}
```

Response:

```json
{
  "data": {
    "energyGroups": [
      {
        "id": "Renovable",
        "type": "Renovable"
      },
      {
        "id": "No-Renovable",
        "type": "No-Renovable"
      },
      {
        "id": "Almacenamiento",
        "type": "Almacenamiento"
      },
      {
        "id": "Demanda en b.c.",
        "type": "Demanda"
      }
    ]
  }
}
```

#### Get Values by Groups

```graphql
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
}
```

Response:

```json
{
  "data": {
    "valuesByGroup": [
      {
        "group": {
          "id": "Almacenamiento",
          "type": "Almacenamiento",
          "totalPercentage": 0.9999999999999998,
          "totalValue": -156.3570000000005
        },
        "categories": [
          {
            "category": {
              "type": "Turbinación bombeo",
              "totalPercentage": 0.492980025553628,
              "totalValue": 5490.111
            },
            "values": [
              {
                "value": 5490.111,
                "percentage": 0.492980025553628,
                "datetime": "2024-12-30T23:00:00.000Z"
              }
            ]
          },
          {
            "category": {
              "type": "Consumo bombeo",
              "totalPercentage": 0.506966097937257,
              "totalValue": -5645.868
            },
            "values": [
              {
                "value": -5645.868,
                "percentage": 0.506966097937257,
                "datetime": "2024-12-30T23:00:00.000Z"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 🧪 Testing
The project uses Jest as the testing framework for both backend and frontend.
### Running Backend Tests

Navigate to backend directory

```bash
cd backend
```

Run all tests
```bash
npm test
```

### Running Frontend Tests

Navigate to frontend directory

```bash
cd frontend
```

Run all tests

```bash
npm test
```

**Testing Notes**

- Tests are written using Jest along with React Testing Library for frontend components

- To run specific tests, you can use the name pattern:
  ```bash
  npm test -- -t "test name"
  ```
## 📷 Screenshots

### Global Tab

![](./readme-imgs/global-temporal-l-with-date.png)

![](./readme-imgs/global-temporal-d-with-date.png)

![](./readme-imgs/global-temporal-l-with-less-cat.png)

![](./readme-imgs/global-temporal-d-with-less-cat.png)

![](./readme-imgs/accumulated-l-with-less-cat.png)

![](./readme-imgs/distribution-l-less-cat.png)

![](./readme-imgs/total-card-l-all-cat.png)

### Grouped Tab

![](./readme-imgs/total-card-l-all-grp.png)

![](./readme-imgs/details-table-l.png)


## ⚙️ Project structure

```
📁 ree-balance-project
├── 📄 README.md
├── 📂 backend
│   ├── ⚙️ .env
│   ├── ⚙️ .gitignore
│   ├── 📄 dockerfile
│   ├── 📄 jest.config.ts
│   ├── ⚙️ nodemon.json
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📂 seed
│   │   └── 📂 2024
│   │       ├── ⚙️ energyCategories.json
│   │       ├── ⚙️ energyGroups.json
│   │       └── ⚙️ energyValues.json
│   ├── 📂 src
│   │   ├── 📄 config.ts
│   │   ├── 📂 graphql
│   │   │   ├── 📂 models
│   │   │   │   ├── 📄 EnergyCategory.ts
│   │   │   │   ├── 📄 EnergyGroup.ts
│   │   │   │   └── 📄 EnergyValue.ts
│   │   │   ├── 📄 resolvers.ts
│   │   │   ├── 📄 schema.ts
│   │   │   └── 📄 typeDefs.ts
│   │   ├── 📄 index.ts
│   │   └── 📂 sync
│   │       ├── 📄 fetchData.ts
│   │       ├── 📂 models
│   │       │   └── 📄 SyncLog.ts
│   │       ├── 📄 saveData.ts
│   │       ├── 📄 sync.ts
│   │       └── 📄 syncLog.ts
│   ├── 📂 tests
│   │   └── 📂 sync
│   │       └── 📄 fetchData.test.ts
│   └── ⚙️ tsconfig.json
├── 🚀 docker-compose.yml
├── 📂 frontend
│   ├── ⚙️ .env
│   ├── ⚙️ .gitignore
│   ├── 📄 dockerfile
│   ├── 📄 eslint.config.js
│   ├── 📄 index.html
│   ├── 📄 jest.config.ts
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📂 public
│   │   └── 📄 vite.svg
│   ├── 📂 src
│   │   ├── 📄 App.tsx
│   │   ├── 📂 components
│   │   │   ├── 📂 Dashboard
│   │   │   │   ├── 📄 ChartEmpty.tsx
│   │   │   │   ├── 📄 ChartError.tsx
│   │   │   │   ├── 📄 ChartLoading.tsx
│   │   │   │   ├── 📄 DetailsTable.tsx
│   │   │   │   ├── 📄 DistributionChart.tsx
│   │   │   │   ├── 📄 StackedAreaChart.tsx
│   │   │   │   ├── 📄 TemporalChart.tsx
│   │   │   │   └── 📄 TotalCardComponent.tsx
│   │   │   ├── 📂 EnergyLayout
│   │   │   │   ├── 📄 Index.tsx
│   │   │   │   ├── 📄 MainFooter.tsx
│   │   │   │   └── 📄 MainHeader.tsx
│   │   │   ├── 📄 EnergyToggles.tsx
│   │   │   └── 📂 RangeDatePicker
│   │   │       ├── 📄 PickerCustomInput.tsx
│   │   │       └── 📄 index.tsx
│   │   ├── 📄 index.css
│   │   ├── 📄 main.tsx
│   │   ├── 📂 pages
│   │   │   ├── 📂 Grouped
│   │   │   │   └── 📄 index.tsx
│   │   │   └── 📂 Home
│   │   │       └── 📄 index.tsx
│   │   ├── 📂 queries
│   │   │   ├── 📄 allEnergyGroups.ts
│   │   │   └── 📄 filteredGroups.ts
│   │   ├── 📂 routes
│   │   │   └── 📄 AppRouter.tsx
│   │   ├── 📂 utils
│   │   │   ├── 📄 constants.ts
│   │   │   └── 📄 formatUtils.ts
│   │   └── 📄 vite-env.d.ts
│   ├── 📂 tests
│   │   └── 📂 components
│   │       ├── 📂 Dashboard
│   │       │   ├── 📄 ChartEmpty.test.tsx
│   │       │   ├── 📄 ChartError.test.tsx
│   │       │   └── 📄 ChartLoading.test.tsx
│   │       └── 📂 RangeDatePicker
│   │           └── 📄 PickerCustomInput.test.tsx
│   ├── ⚙️ tsconfig.app.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   └── 📄 vite.config.ts
└── 📂 mongo
    ├── ⚙️ .gitignore
    └── 📄 mongo-init.js
```

## 📚 Acknowledgements

- [REE](https://www.ree.es/) for providing the public API with electric balance data.
