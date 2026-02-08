import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components';
import { DEFAULT_ROUTE_COMPONENT, ROUTE_MAP } from './routes';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const RouteComponent = ROUTE_MAP[route] ?? DEFAULT_ROUTE_COMPONENT;

  return (
    <ErrorBoundary>
      <RouteComponent />
    </ErrorBoundary>
  );
}

export default App;
