import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function FeatureDevelopmentPage() {
  return (
    <>
      <PageMeta
        title="Fitur dalam Pengembangan | HRIS"
        description="Halaman fitur yang sedang dalam proses pengembangan"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center justify-center  mx-auto text-center">
          
          {/* Rocket illustration */}
          <div className="relative mb-12">
            {/* Circular outline */}
            {/* <div className="w-48 h-48 rounded-full border-4 border-dashed border-blue-300 flex items-center justify-center"> */}
              {/* Rocket SVG */}
           <img src="public/images/logo/147_rocket_launch_flatline.svg" alt="Rocket"  />

            {/* </div> */}
            
            {/* Decorative dashed lines */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-2 border-dashed border-blue-200 animate-spin-slow"></div>
            </div> */}
          </div>

          {/* Main heading */}
          <h1 className="mb-3 font-bold text-gray-900 text-4xl sm:text-5xl leading-tight text-center" 
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Fitur baru sedang dalam proses pengembangan
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-gray-600 text-xl sm:text-2xl leading-none text-center"
             style={{ fontFamily: 'Outfit, sans-serif' }}>
            kami akan segera merilisnya untuk mempermudah pekerjaan Anda.
          </p>

          {/* CTA Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Additional decorative elements */}
        {/* <div className="absolute top-20 right-20 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-pulse"></div> */}
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </>
  );
}
