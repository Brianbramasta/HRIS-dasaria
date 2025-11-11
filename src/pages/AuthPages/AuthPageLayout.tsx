import React from 'react';
// import { Zoom } from 'swiper/modules';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/grid-image/bg-login.jpg')" }}>
        <div className="flex pt-[40px] pl-[80px] h-full bg-black opacity-50">
         
        </div>
        <div className="absolute top-0 pt-[40px] pl-[80px] h-full bg-transparent">
          <img src="/images/logo/logo-login.svg" style={{zoom:
            "80%"
          }} alt="" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
