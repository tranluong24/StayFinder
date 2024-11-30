import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppContextProvider } from './contexts/AppContext'
import { SearchContextProvider } from './contexts/SearchContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <App/>
        </SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
)
