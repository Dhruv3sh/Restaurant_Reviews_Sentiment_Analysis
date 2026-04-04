import Layout from './Components/Layout'
import { ThemeProvider } from './Context/ThemeContext'
import Home from './Pages/Home'
// import SentimentChecker from './SentimentChecker'

const App = () => {

  return (
    <>
    <ThemeProvider>
      <Layout>
      <Home/>
    </Layout>
    </ThemeProvider>
    </>
  )
}

export default App
