import logo from './logo.svg';
import './App.css';
import Header from './Header/header';
import Home from './Home/home';
import Cart from './Cart/cart';
import Detail from './Detail/detail';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<Home />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/book/:id" element={<Detail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
