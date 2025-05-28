"use client"
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
    return (
        <footer className="bg-[#0c0f16] text-white px-8 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">

                {/* Logo */}
                <div className="bg-white rounded-full px-8 py-6 border border-gray-300 text-center text-gray-800 font-semibold">
                    <img
                        className="h-10 w-40"
                        src="/images/namaLogo.png"
                        alt=""
                    />
                </div>

                {/* Kontak Info */}
                <div className="flex gap-4 items-start">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center text-sm"><MapPinIcon className="h-10 w-10 text-red-500" /></div>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center text-sm"><PhoneIcon className="h-6 w-6 text-blue-500" /></div>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center text-sm"><EnvelopeIcon className="h-7 w-7 text-red-500" /></div>
                    </div>
                    <div className="flex flex-col gap-4 text-gray-800 text-sm">
                        <div>
                            <p className="text-sm text-gray-400">Lokasi</p>
                            <p className="font-semibold text-white mb-3">Jakarta ke sumatera</p>
                        </div>
                        <p className="font-semibold text-white mb-5">+62-822-2233-4455</p>
                        <p className="font-semibold text-white">Email</p>
                    </div>
                </div>

                {/* Deskripsi dan Icon */}
                <div className="flex flex-col gap-4 text-white">
                    <p className="text-lg font-bold">Lokasi</p>
                    <p className="max-w-xs text-sm">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. At numquam maiores temporibus
                    </p>
                    <div className="flex gap-4 mt-2">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center text-sm">Icon</div>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center text-sm">Icon</div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
