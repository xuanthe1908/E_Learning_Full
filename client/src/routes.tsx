import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorElement from "./components/common/error-element";
import { Customer, Admin } from "./App";
import { Seller } from "./App";
import SellerDashboard from "./components/pages/sellers/seller-dash-board";
import AddCategory from "./components/pages/categories/add-category";
import EditCategory from "./components/pages/categories/edit-category";
import ListCategories from "./components/pages/categories/list-category";
import DashHome from "./components/pages/customer-dash/dash-home";
import SellerChannels from "./components/pages/channel/seller-channels";
import VNPayQRPayment from "./components/pages/payment-vnpay/vnpayQRPayment";
import VNPayReturnHandler from "components/pages/payment-vnpay/vnpay-return-handler";

const LazyListProduct = lazy(
  () => import("./components/pages/shop-pages/product-list")
);

const LazySellersListing = lazy(
  () => import("./components/pages/sellers/list-all-sellers")
);

const LazyCustomerDash = lazy(
  () => import("./components/pages/customer-dash/user-dashboard")
);

const LazySellerIndex = lazy(
  () =>
    import("./components/pages/seller-management/view-sellers-index")
);

const LazyCustomers = lazy(
  () => import("./components/pages/customer-management/customers-tab")
);

const LazyCategories = lazy(
  () => import("./components/pages/categories/category-page")
);

const LazyViewProduct = lazy(
  () => import("./components/pages/shop-pages/product-detail")
);

const LazyWatchItem = lazy(
  () => import("./components/pages/shop-pages/watch-item")
);

const LazyAddProduct = lazy(
  () => import("./components/pages/add-product/add-product-form")
);

const LazyViewItems = lazy(
  () => import("./components/pages/add-item/view-items")
);

const LazyListProductForSellers = lazy(
  () => import("./components/pages/add-item/list-product-for-sellers")
);

const LazyEditItem = lazy(
  () => import("./components/pages/add-item/edit-item")
);

const LazyEditProduct = lazy(
  () => import("./components/pages/add-product/edit-product")
);

const LazyMyCustomers = lazy(
  () => import("./components/pages/sellers/my-customers")
);

const LazySellerProfile = lazy(
  () => import("./components/pages/sellers/seller-profile")
);

const LazyViewSeller = lazy(
  () => import("./components/pages/sellers/view-seller")
);

const LazyCustomerProfile = lazy(
  () => import("./components/pages/customer-dash/my-profile")
);

const LazyCustomerProducts = lazy(
  () => import("./components/pages/customer-dash/my-products")
);

const LazyCustomerHomePage = lazy(
  () => import("./components/pages/customers/customer-home-page")
);

const LazyCustomerLogin = lazy(
  () => import("./components/pages/customers/customer-login-page")
);
const LazyCustomerRegister = lazy(
  () => import("./components/pages/customers/customer-registration-page")
);
const LazySellerLogin = lazy(
  () => import("./components/pages/sellers/seller-login-page")
);
const LazySellerRegister = lazy(
  () => import("./components/pages/sellers/seller-register-page")
);
const LazyAdminHome = lazy(
  () => import("./components/pages/admin/admin-home-page")
);
const LazySellerRequests = lazy(
  () =>
    import("./components/pages/seller-management/view-seller-requests")
);
const LazyViewMoreSellerRequest = lazy(
  () =>
    import(
      "./components/pages/seller-management/view-more-seller-request"
    )
);
const LazyViewBlockedSellers = lazy(
  () =>
    import("./components/pages/seller-management/view-blocked-sellers")
);

const LazyChatAI = lazy(
  () => import("./components/pages/shop/ShopPage")
);

const LazyAboutUs = lazy(() => import("./components/pages/about/about-us"));

const LazyContactPage = lazy(
  () => import("./components/pages/contact/contact-us")
);

const LazyPayment = lazy(
  () => import("./components/pages/payment-vnpay/vnpayQRPayment")
);

const LazyCartPage = lazy(() => import('./components/pages/cart/cart-page'));

const LazyCheckoutPage = lazy(() => import('./components/pages/checkout/checkout-page'));

const LazyOrderConfirmation = lazy(() => import('./components/pages/checkout/order-confirmation'));

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Customer />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCustomerHomePage />
          </Suspense>  
        ),
      },
      {
        path: "/shop",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyListProduct />
          </Suspense>
        ),
      },
      {
        path: "/shop/:productId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyViewProduct />
          </Suspense> 
        ),
      },
      {
        path: "/products/:productId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyViewProduct />
          </Suspense> 
        ),
      },
      {
        path: "/shop/:productId/view/:itemId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyWatchItem />
          </Suspense>
        ),
      },
      {
        path: "/tutors", 
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazySellersListing />
          </Suspense>
        ),
      },
      {
        path: "/tutors/:tutorId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyViewSeller />
          </Suspense>
        ),
      },
      {
        path: "/chat-ai",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyChatAI />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyAboutUs />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyContactPage />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCartPage />
          </Suspense>
        ),
      },
      {
        path: "/checkout",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCheckoutPage />
          </Suspense>
        ),
      },
      {
        path: "/order-confirmation",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyOrderConfirmation />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyCustomerDash />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <DashHome />,
      },
      {
        path: "my-products",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCustomerProducts />
          </Suspense>
        ),
      },
      {
        path: "my-profile",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCustomerProfile />
          </Suspense>
        ),
      },
    ],
  },
  {
  path: "/shop/:productId/payment",
  element: <VNPayQRPayment />, 
  },
  {
  path: "/payment/vnpay/return",
  element: <VNPayReturnHandler />, 
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyCustomerLogin />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyCustomerRegister />
      </Suspense>
    ),
  },
      {
        path: "/sellers/login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazySellerLogin />
          </Suspense>
        ),
      },
      {
        path: "/sellers/register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazySellerRegister />
          </Suspense>
        ),
      },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>loading...</div>}>
            <LazyAdminHome />
          </Suspense>
        ),
      },
      {
        path: "sellers",
        element: (
          <Suspense fallback={<div>loading...</div>}>
            <LazySellerIndex />
          </Suspense>
        ),
        children: [
          {
            path: "requests",
            element: (
              <Suspense fallback={<div>loading...</div>}>
                <LazySellerRequests />
              </Suspense>
            ),
          },
          {
            path: "requests/:id",
            element: (
              <Suspense fallback={<div>loading...</div>}>
                <LazyViewMoreSellerRequest />
              </Suspense>
            ),
          },
          {
            path: "blocked",
            element: (
              <Suspense fallback={<div>loading...</div>}>
                <LazyViewBlockedSellers />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "customers",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCustomers />
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCategories />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <ListCategories />,
          },
          {
            path: "add-category",
            element: <AddCategory />,
          },
          {
            path: "edit-category/:categoryId",
            element: <EditCategory />,
          },
        ],
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyListProduct />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: <div className="p-4">Settings (placeholder)</div>,
      },
    ],
  },
  {
    path: "/sellers",
    element: <Seller />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <SellerDashboard />,
      },
      {
        path: "add-product",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyAddProduct />
          </Suspense>
        ),
      },
      {
        path: "view-products",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyListProductForSellers />
          </Suspense>
        ),
      },
      {
        path: "edit-product/:productId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyEditProduct />
          </Suspense>
        ),
      },
      {
        path: "view-items/:productId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyViewItems />
          </Suspense>
        ),
      },
      {
        path: "view-items/:productId/edit-item/:itemId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyEditItem />
          </Suspense>
        ),
      },
      {
        path: "view-customers",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyMyCustomers />
          </Suspense>
        ),
      },
      {
        path: "view-profile",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazySellerProfile />
          </Suspense>
        ),
      },
      {
        path: "view-channels",
        element: <SellerChannels />,
      },
      {
        path: ":productId/payment",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPayment />
          </Suspense>
        ),
      },
    ],
  },
]);
export default AppRouter;





















