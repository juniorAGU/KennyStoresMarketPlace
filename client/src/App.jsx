import Errorplace from './Components/Errorplace';
import './App.css'
import RoutesGate from './Components/RoutesGate';
import Routes from './RoutsConfig/Routes';
import LayeroutsSelector from './Layouts/LayeroutsSelector';
import AuthContectProvider from './Context/AuthContect';
import ProductcontextProvider from './Context/Productcontext';
import CommentsProvider from './Context/CommentsProvider';
import Cartprovider from './Context/Cartprovider';
import Payoutprovider from './Context/Payoutprovider';

// internal packages
import { createBrowserRouter,RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
    {
      path: "/",
      element: <LayeroutsSelector />,
      errorElement: <Errorplace />,
      children: Routes.map(route => ({
        path: route.path === "/" ? undefined : route.path,
        index: route.path === "/",
        element: (
            <RoutesGate 
                component={route.components}
                isProtected={route.isProtected}
                role={route.role}
                accountType={route.accountType}
            />
        )
      }))
    }
  ]);


function App() {
  return(
    <AuthContectProvider>
      <Cartprovider>
        <CommentsProvider>
          <ProductcontextProvider>
            <Payoutprovider>
                <RouterProvider router={router}/>
            </Payoutprovider>
          </ProductcontextProvider>
        </CommentsProvider>
      </Cartprovider>
    </AuthContectProvider>
    
  )
    
  
}

export default App
