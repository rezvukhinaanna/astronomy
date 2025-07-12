import { Routes, Route } from "react-router";
import { Header, Footer, Error } from "./components";
import {
  Main,
  Registration,
  Authorisation,
  Product,
  ShoppingCart,
  About,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.main}>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Authorisation />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product/:id/edit" element={<Product />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
