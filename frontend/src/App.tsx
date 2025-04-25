import EnergyLayout from "./components/EnergyLayout/Index";
import AppRouter from "./routes/AppRouter";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <EnergyLayout>
          <AppRouter />
        </EnergyLayout>
      </ApolloProvider>
    </>
  );
}

export default App;
