import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MarketPlace from "../pages/MarketPlace";
import About from "../pages/About";
import ProductDetails from "../Components/ProductDetails";
import EditProfile from "../Components/EditProfile";
import SellerDashboard from "../pages/SellerDashboard";
import AddProduct from "../pages/AddProduct";
import MyProducts from "../pages/MyProducts";
import EditeProduct from "../pages/EditeProduct";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrdersDetails from "../pages/OrdersDetails";
import SellersStore from "../pages/SellersStore";
import SellerOrder from "../pages/SellerOrder";

const Routes = [
    {
        path: "/",
        components: Home,
        isProtected: false,
        role: ["user", "admin", "manager"]
    },
    {
        path: "contact",
        components: Contact,
        isProtected: false,
        role: ["user", "admin", "manager"]
    },
    {
        path: 'about',
        components: About,
        isProtected: false,
        role: ["user", "admin", "manager"]
    },
    {
        path: "dashboard",
        components: SellerDashboard,
        isProtected: true,
        role: ["user", "manager", "admin"],
        accountType: "seller"
    },
    {
        path: 'cart',
        components: Cart,
        isProtected: true,
        role: ["user", "manager", "admin"],
        accountType: "buyer"
    },
    {
        path: 'checkout',
        components: Checkout,
        isProtected: true,
        role: ["user", "manager", "admin"],
        accountType: "buyer"
    },
    {
        path: 'orders',
        components: Orders,
        isProtected: true,
        role: ["user", "manager", "admin"],
        accountType: "buyer"
    },
    {
        path: 'orders/:orderId',
        components: OrdersDetails,
        isProtected: true,
        role: ["user", "manager", "admin"],
        accountType: "buyer"
    },
    {
        path: 'seller/:sellerId',
        components: SellersStore,
        isProtected: true,
        role: ["user", "manager", "admin"],
    },
    {
        path: 'sellerOrders',
        components: SellerOrder,
        isProtected: true,
        role: ["user", "manager", "admin"],
    },
    {
        path: "/addproduct",
        components: AddProduct,
        isProtected: true,
        role: ["user", "admin", "manager"],
        accountType: "seller"
    },
    {
        path: "/myproducts",
        components: MyProducts,
        isProtected: true,
        role: ["user", "admin", "manager"],
        accountType: "seller"

    },
    {
        path: "marketplace/:id",
        components: ProductDetails,
        isProtected: true,
        role: ["user", "admin", "manager"]

    },
    {
        path: "editeproducts/:id",
        components: EditeProduct,
        isProtected: true,
        role: ["user", "admin", "manager"],
        accountType: "seller"

    },
    {
        path: "/profile/edit",
        components: EditProfile,
        isProtected: true,
        role: ["user", "admin", "manager"]
    },
    {
        path: "marketplace",
        components: MarketPlace,
        isProtected: true,
        role: ["user", "admin", "manager"]
    },
    {
        path: "login",
        components: Login,
        isProtected: false,
        role: []
    },
    {
        path: "register",
        components: Register,
        isProtected: false,
        role: []
    }
];

export default Routes