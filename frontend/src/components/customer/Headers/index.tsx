'use client'

import { useState } from 'react'
import {
    ArrowRightEndOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/dashboard" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-10 w-auto"
                            src="/images/namaLogo.png"
                            alt=""
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="/dashboard/order" className="text-m font-semibold leading-6 text-gray-900">Order</a>
                    <a href="/dashboard/payment" className="text-m font-semibold leading-6 text-gray-900">Pembayaran</a>
                    <a href="/dashboard/profile" className="text-m font-semibold leading-6 text-gray-900">Profile</a>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="/" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1">
                        Exit <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    </a>
                </div>
            </nav>

            {mobileMenuOpen && (
                <>


                    {/* Sidebar */}
                    <div className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-12 w-auto"
                                    src="/images/logo.png"
                                    alt=""
                                />
                            </a>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 space-y-2">
                            <a href="/dashboard/order" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Order</a>
                            <a href="/dashboard/payment" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Pembayaran</a>
                            <a href="/dashboard/profile" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Profile</a>
                            <a href="/" className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">Exit</a>
                        </div>
                    </div>
                </>
            )}
        </header>
    )
}
