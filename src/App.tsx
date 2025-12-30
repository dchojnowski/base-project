import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { OverviewPage } from './pages/OverviewPage';
import { RecordsPage } from './pages/RecordsPage';
import { Button } from './components/ui/button';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'records', element: <RecordsPage /> }
    ]
  }
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOverview = location.pathname === '/';
  const isRecords = location.pathname.startsWith('/records');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Sales Dashboard</p>
            <h1 className="text-xl font-semibold">Mini Analytics</h1>
          </div>
          <nav className="flex gap-2">
            <Button
              type="button"
              onClick={() => navigate('/')}
              className={isOverview ? '' : 'bg-secondary text-secondary-foreground hover:opacity-90'}
            >
              Overview
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/records')}
              className={isRecords ? '' : 'bg-secondary text-secondary-foreground hover:opacity-90'}
            >
              Records
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
