import { BrowserRouter as Router, Routes, Navigate, Route} from 'react-router-dom';
import Layout from './layouts/Layout';
import Register from './pages/Register';

function App() {
  return (
      <Router>
        <Routes>
          <Route path ="/" element = {
            <Layout>
              <p>Home Page</p>
            </Layout>}>
          </Route>

          <Route path ="/search" element = {
            <Layout>
              <p>Search Page</p>
            </Layout>}>
          </Route>

          <Route path = "/register" element = {
            <Layout>
              <Register/>
            </Layout>}>
          </Route>

        </Routes>
      </Router>
  )
}
export default App
