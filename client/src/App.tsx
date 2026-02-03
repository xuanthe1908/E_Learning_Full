import React, { useEffect, useState } from "react";
import CustomerHeader from "./components/partials/customer-header";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import AdminLoginPage from "./components/pages/admin/admin-login-page";
// import { Sidenav } from "./components/pages/admin/widgets/layout";  
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import SellerSideNav from "./components/pages/sellers/seller-side-nav";
import SellerHeader from "./components/pages/sellers/seller-header";
import useIsOnline from "./hooks/useOnline";
import YouAreOffline from "./components/common/you-are-offline";
import CustomerFooter from "./components/partials/customer-footer";
import { selectIsLoggedIn, selectUserType } from "./redux/reducers/authSlice";
import { selectIsFooterVisible } from "./redux/reducers/helperSlice";
import { fetchCustomerData } from "./redux/reducers/customerSlice";
import SessionExpired from "./components/common/session-expired-modal";
import SellerLoginPage from "./components/pages/sellers/seller-login-page";
import { getSellerDetails } from "./api/endpoints/seller";
import { setDetails } from "./redux/reducers/sellerSlice";
import { AdminSideNav } from "./components/pages/admin/admin-side-nav";
import { toast } from "react-toastify";
import { USE_MOCK_DATA } from "./config/mockConfig";
import { setupMockCustomerAuth, setupMockSellerAuth } from "./utils/mockAuth";   

export const Customer: React.FC = () => {
  const isOnline = useIsOnline();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const isHeaderVisible = true;
  const user = useSelector(selectUserType);
  const footerVisible = useSelector(selectIsFooterVisible);
  // usePreventBackButton(isLoggedIn);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // ✅ Mock Mode: Setup mock customer auth and bypass login check
  React.useEffect(() => {
    if (USE_MOCK_DATA) {
      setupMockCustomerAuth();
      // Set a mock token to bypass auth check
      if (!localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', 'mock.customer.token');
      }
    } else {
      // Clear mock tokens if they exist
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && accessToken.startsWith('mock.')) {
        localStorage.removeItem('accessToken');
      }
      if (refreshToken && refreshToken.startsWith('mock.')) {
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);
  
  // ✅ Mock Mode: Override isLoggedIn check
  const mockIsLoggedIn = USE_MOCK_DATA ? true : isLoggedIn;
  const mockUser = USE_MOCK_DATA ? 'customer' : user;

  const handleCloseSessionExpired = () => {
    setShowSessionExpired(false);
  };

  // Listen for the "sessionExpired" event from the interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };

    window.addEventListener("sessionExpired", handleSessionExpired);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  const headerClassName = `bg-gray-100 ${
    isHeaderVisible
      ? "opacity-100 transition-opacity duration-500 "
      : "opacity-0 "
  }`;

  useEffect(() => {
    if ((USE_MOCK_DATA || isLoggedIn) && (mockUser === "customer" || USE_MOCK_DATA)) {
      // In mock mode, skip API call
      if (!USE_MOCK_DATA) {
        dispatch(fetchCustomerData());
      }
    }
  }, [dispatch, isLoggedIn, user, mockUser]);

  return (
    <>
      {showSessionExpired && (
        <SessionExpired
          show={showSessionExpired}
          onClose={handleCloseSessionExpired}
        />
      )}
      {isOnline ? (
        <div className='bg-white font-sans'>
          <div className={`${headerClassName}`}>
            <CustomerHeader />
          </div>
          <Outlet />
          {footerVisible && <CustomerFooter />}
        </div>
      ) : (
        <YouAreOffline />
      )}
    </>
  );
};

export const Seller: React.FC = () => {
  const isOnline = useIsOnline();
  const user = useSelector(selectUserType);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  
  // ✅ Mock Mode: Setup mock seller auth and bypass login check
  React.useEffect(() => {
    if (USE_MOCK_DATA) {
      setupMockSellerAuth();
      // Set a mock token to bypass auth check
      if (!localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', 'mock.instructor.token');
      }
    } else {
      // Clear mock tokens if they exist
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && accessToken.startsWith('mock.')) {
        localStorage.removeItem('accessToken');
      }
      if (refreshToken && refreshToken.startsWith('mock.')) {
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);
  
  // ✅ Mock Mode: Override isLoggedIn check
  const mockIsLoggedIn = USE_MOCK_DATA ? true : isLoggedIn;
  const mockUser = USE_MOCK_DATA ? 'seller' : user;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSeller = async () => {
    // ✅ Mock Mode: Skip API call
    if (USE_MOCK_DATA) {
      return;
    }

    try {
      const response = await getSellerDetails();
      dispatch(setDetails({details:response.data}))
    } catch (error) {
      console.error("Error fetching seller:", error);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  return (
    <>
      {isOnline ? (
        (mockIsLoggedIn && mockUser === "seller") ? (
          <>
            <div className='fixed inset-x-0 top-0 flex flex-col font-sans'>
              <SellerHeader />
              <div className='flex flex-1'>
                <div className='w-64 h-screen overflow-y-auto'>
                  <SellerSideNav />
                </div>
                <div className='flex  flex-col flex-1'>
                  <div className='p-4 bg-customBlueShade overflow-y-scroll h-screen'>
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <SellerLoginPage />
          </div>
        )
      ) : (
        <YouAreOffline />
      )}
    </>
  );
};

export const Admin: React.FC = () => {
  const isAdminLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUserType);
  const isOnline = useIsOnline();
  return (
    <>
      {isOnline ? (
        isAdminLoggedIn && user === "admin" ? (
          <div className='bg-gray-100  items-center  flex justify-center font-sans overflow-y-hidden'>
            <div className='w-80'>   
              <AdminSideNav />  
            </div>
            <div className='flex-1 pl-4 h-screen max-h-full overflow-y-scroll mt-5'>
              {/* Use 'h-screen' and 'max-h-full' to allow the container to take the full screen height */}
              <Outlet />
            </div>   
          </div>
        ) : (    
          <div className='bg-gray-100'>
            <AdminLoginPage />
          </div>
        )
      ) : (
        <YouAreOffline />
      )}
    </>
  );
};






















