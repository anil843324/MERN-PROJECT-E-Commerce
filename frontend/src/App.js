import './App.css';

import Header from './component/layout/Header';
import { Routes ,Route} from 'react-router-dom'


function App() {
  return (
  
     <>
      <Header />

      {/* <Route path="/home" element={<ProtectedRoute Component={Home} />} />
        <Route path="/infopage/:id" element={<ProtectedRoute Component={InfoPage} />} />
        <Route path="/shortlist" element={<ProtectedRoute Component={ShortList} />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

     </>
     
   
  );
}

export default App;
