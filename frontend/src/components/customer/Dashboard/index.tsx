"use client"

import Link from "next/link";
import {
    UserCircleIcon,
    TruckIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from "react";



const DashboardMenu = () => {
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/getUser");
                const data = await res.json();
                const imagePath = data?.user?.image;
                if (imagePath) {
                    setUserImage(`http://localhost:2000${imagePath}`);
                }
            } catch (error) {
                console.error("Gagal memuat user:", error);
            }
        };

        fetchUser();
    }, []);

    const menuItems = [
        {
            title: "Order", href: "/dashboard/order", icon: <img
                className="h-35 w-35"
                src="/images/customer/container.png"
                alt=""
            />
        },
        {
            title: "Pembayaran", href: "/dashboard/payment", icon: <img
                className="h-25 w-25"
                src="/images/customer/wallet.png"
                alt=""
            />
        },
        {
            title: "Profile", href: "/dashboard/profile", icon: userImage ? (
                <img
                    src={userImage}
                    alt="User"
                    className="h-40 w-40 object-cover rounded-full"
                />
            ) : (
                <UserCircleIcon className="h-40 w-40 text-green-500" />
            )
        },
    ];
    return (
        <div className="relative w-full min-h-screen">
            <div className="absolute inset-0 -z-10">
                <img
                    src="/images/ilustrasi.jpg" 
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-none -z-10" />

            <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row flex-wrap justify-center items-center gap-8 md:gap-20 pt-24 pb-24">
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <div className="bg-white w-75 h-75 shadow-md rounded-md flex flex-col items-center justify-center transition hover:scale-105">
                            <div className="w-40 h-40 mb-6 rounded-full bg-[#dee6ef] border border-gray-400 flex items-center justify-center">
                                {item.icon ?? null}
                            </div>
                            <span className="text-black text-xl font-semibold">{item.title}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardMenu;
