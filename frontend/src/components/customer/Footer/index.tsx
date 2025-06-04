"use client"
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline'
import { FacebookIcon, Map, MapIcon } from 'lucide-react';

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
                            <p className="font-semibold text-white">Jakarta ke Sumatera Barat - Riau</p>
                        </div>
                        <div>
                            <p className="font-semibold text-white">0823 - 2253 - 3539</p>
                            <p className="font-semibold text-white mb-3">0822 - 1318 - 8323</p>
                        </div>
                        <p className="font-semibold text-white">Email</p>
                    </div>
                </div>

                {/* Deskripsi dan Icon */}
                <div className="flex flex-col gap-4 text-white">
                    <p className="text-lg font-bold">Lokasi</p>
                    <p className="max-w-xs text-sm">
                        Jl.Kyai Mas Mansyur No.25, Komplek Said Naum, Tanah Abang
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a
                            href="https://www.facebook.com/share/16m9kVvEj6/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center hover:shadow-md transition">
                                <FacebookIcon className="w-6 h-6 text-blue-700" />
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
