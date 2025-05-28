"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, ExclamationCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { logout } from "./logout";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { CircleUserRound } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
  alamat: string;
  no_hp: string;
  email?: string;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState("");

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/getUser", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setImage(data.user?.image || "");
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          {image ? (
            <img
              src={`http://localhost:2000${image}`}
              alt="User Image"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <CircleUserRound className="w-40 h-40 text-gray-500" />
          )}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.name || "Loading..."}</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name || "Unknown User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || "Email tidak ditemukan"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/staff/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserCircleIcon className="h-6 w-6" />
              Edit profile
            </DropdownItem>
          </li>
        </ul>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            Sign out
          </button>
        </form>
      </Dropdown>
    </div>
  );
}
