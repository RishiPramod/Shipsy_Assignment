import { AuthProvider } from './contexts/Auth';
import { ThemeProvider } from './contexts/Theme';
import AppRoutes from './routes';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
