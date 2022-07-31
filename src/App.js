import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import AppContainer from './Container/AppContainer'



function App() {
  return (
    <ChakraProvider >
      <AppContainer />
    </ChakraProvider>
  );
}

export default App;
