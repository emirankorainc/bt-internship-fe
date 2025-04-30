import AuthProvider from './provider/authProvider';
import Root from './routes/root';

function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

export default App;
