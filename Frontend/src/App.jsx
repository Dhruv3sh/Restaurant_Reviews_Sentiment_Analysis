import { Outlet } from "react-router-dom";
import Layout from "./Components/Layout";
import ReviewProvider from './Context/ReviewProvider' 
import { ThemeProvider } from "./Context/ThemeContext";
import Home from "./Pages/Home";
// import SentimentChecker from './SentimentChecker'

const App = () => {
  return (
    <>
      <ThemeProvider>
        <ReviewProvider>
          <Layout>
            <Outlet />
          </Layout>
        </ReviewProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
