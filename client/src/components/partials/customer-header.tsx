import React from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "../elements/profile-menu";
import { selectIsLoggedIn } from "../../redux/reducers/authSlice";
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { APP_LOGO } from "../../constants/common";
import { selectUserType } from "../../redux/reducers/authSlice";
import { selectCartTotalItems } from "../../redux/reducers/cartSlice";

const navigation = [
  { name: "Trang chủ", href: "/", current: true },
  { name: "Sản phẩm", href: "/shop", current: false },
  { name: "Chat AI", href: "/chat-ai", current: false },
  { name: "Về chúng tôi", href: "/about", current: false },
  { name: "Liên hệ", href: "/contact", current: false },
];


function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const CustomerHeader: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUserType);
  const cartItemsCount = useSelector(selectCartTotalItems);


  const handleNavigation = (item: any) => {
    navigation.forEach((navItem) => {
      navItem.current = navItem.href === item.href;
    });
  };
      
  return (
    <div className='bg-white border-b border-gray-200 shadow-sm'>
      <Disclosure
        as='nav'
        className='bg-white px-4 sm:px-6 lg:px-8'
      >
        {({ open }) => (
          <>
            <div className='max-w-7xl mx-auto w-full'>
              <div className='flex items-center justify-between h-16'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <Link to='/'>
                      <img className='h-10' src={APP_LOGO} alt='Your Company' />
                    </Link>
                  </div>
                  <div className='hidden md:block ml-10'>
                    <div className='flex items-center space-x-2'>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => handleNavigation(item)}
                          className={classNames(
                            item.current
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md"
                              : "text-gray-700 hover:text-blue-600 font-semibold hover:bg-blue-50 ",
                            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {isLoggedIn && user === 'customer' ? (
                  <div className='hidden md:flex items-center gap-4'>
                    <Link to='/cart' className='relative p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                      <ShoppingCartIcon className='h-6 w-6 text-gray-700' />
                      {cartItemsCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md'>
                          {cartItemsCount > 99 ? '99+' : cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link to='/dashboard'>
                      <Button size='md' className='bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg'>
                        Dashboard
                      </Button>
                    </Link>
                    <ProfileMenu />
                  </div>
                ) : (
                  <div className='hidden md:flex items-center gap-3'>
                    <Link to='/cart' className='relative p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                      <ShoppingCartIcon className='h-6 w-6 text-gray-700' />
                      {cartItemsCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md'>
                          {cartItemsCount > 99 ? '99+' : cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link to='/login'>
                      <button className='bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'>
                        Đăng nhập
                      </button>
                    </Link>
                    <Link to='/register'>
                      <button className='bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 font-semibold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors'>
                        Đăng ký
                      </button>
                    </Link>
                  </div>
                )}
                <div className='-mr-2 flex md:hidden'>
                  <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white'>
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className='lg:hidden'>
              <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleNavigation(item)}
                    className={classNames(
                      item.current
                        ? "bg-blue-gray-500 text-white"
                        : "text-blue-gray-600 hover:bg-gray-300 hover:text-blue-gray-800",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='border-t border-gray-700 pb-3 pt-4'>
                <div className='mt-3 space-y-1 px-2'>
                  <Link to='/cart' className='flex items-center justify-center gap-2 mb-2 block rounded-md px-3 py-2 text-base font-medium text-gray-200 bg-gray-600 hover:bg-gray-500'>
                    <ShoppingCartIcon className='h-5 w-5' />
                    Giỏ hàng
                    {cartItemsCount > 0 && (
                      <span className='bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </span>
                    )}
                  </Link>
                  {isLoggedIn && user === 'customer' ? (
                    <>
                      <Link to='/dashboard'>
                        <button className='w-full mb-2 block rounded-md px-3 py-2 text-base font-medium text-gray-200 bg-blue-600 hover:bg-blue-700'>
                          Dashboard
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to='/login'>
                        <button className='w-full mb-2 block rounded-md px-3 py-2 text-base font-medium  text-gray-200 bg-blue-gray-300 hover:bg-blue-gray-500   hover:text-white'>
                          Đăng nhập
                        </button>
                      </Link>
                      <Link to='/register'>
                        <button className='w-full mb-2 block rounded-md px-3 py-2 text-base font-medium  text-gray-200 bg-blue-gray-300 hover:bg-blue-gray-500  hover:text-white'>
                          Đăng ký
                        </button>
                      </Link>
                      <Link to='/sellers/login'>
                        <button className='w-full block bg-purple-800 hover:bg-purple-900 text-sm text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                          Người bán
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default CustomerHeader;



























