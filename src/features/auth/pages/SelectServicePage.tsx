import { useSelectService } from '../hooks/Index';

export default function SelectServicePage() {
    const {
        user,
        services,
        handleLogout,
        handleServiceClick
    } = useSelectService();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="/images/logo/logo-icon.svg" alt="Dasaria SSO" className="h-8" />
                    <span className="text-xl font-bold text-orange-500 tracking-wide hidden sm:inline-block">DASARIA <span className="text-blue-600">SSO</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img src={user?.avatar || "/images/user/owner.jpg"} alt={user?.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium hidden sm:block">{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang {user?.name} !</h1>
                    <p className="text-gray-600">Silhakan pilih modul sistem yang ingin Anda akses.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => handleServiceClick(service.path)}
                            className="bg-[#004969] hover:bg-[#66A4C0] transition-colors rounded-lg p-6 cursor-pointer flex items-center gap-4 text-white hover:text-[#004969] shadow-lg h-40 group relative overflow-hidden"
                        >
                            {/* Decorative Gradient/Overlay if needed */}
                            {/* change bg if need to bg-transparent -> bg-white */}
                            <div className="bg-transparent rounded-xl h-16 w-16 flex-shrink-0 flex items-center justify-center">
                                {/* Using the text HRIS as logo if icon fails or generic icon */}
                                <span className="text-[#004969] font-bold text-xs">
                                    <img src={service.icon} alt={service.title} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = service.title }} />
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">{service.title}</h2>
                                <p className="text-sm leading-snug">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
