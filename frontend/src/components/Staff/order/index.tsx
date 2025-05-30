"use client"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import Toast from "@/components/Toast";
import axiosInstance from "@/lib/axiosInstance";
import InputOrderForm from "./input";
import OrderForm from "./input";
import { parseJwt } from "@/utils/auth";
import { Info, RefreshCw, Trash2 } from "lucide-react";
import OrderInfo from "./info";
// import UpdateOrderForm from "./update";

export default function Order() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOrderInfoOpen, setIsOrderInfoOpen] = useState<boolean>(false);



  // get semua data Order + search
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:2000/order", {
        params: {
          search: searchQuery,
          page,
          perPage,
        },
        withCredentials: true,
      });

      setItems(response.data.data);
      setTotal(response.data.total);
      console.log("Order response:", response.data);
    } catch (error) {
      console.error("Gagal mengambil data dari order pengiriman:", error);
      setToast({ type: "error", message: "Gagal mengambil data dari order pengiriman." });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUser", {
          method: "GET",
          credentials: "include", // penting agar cookie dikirim
        });

        const data = await res.json();

        if (data.user && data.user.id) {
          setCurrentUserId(data.user.id.toString());
          console.log("User login:", data.user);
        } else {
          console.warn("ID user tidak ditemukan di token:", data);
        }
      } catch (err) {
        console.error("Gagal mengambil user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("currentUserId di OrderForm:", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    fetchOrders();
  }, [page, searchQuery]);

  //Search
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  // info
  const handleOpenOrderInfo = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsOrderInfoOpen(true);
  };

  const handleCloseOrderInfo = () => {
    setIsOrderInfoOpen(false);
    // Optionally reset the selectedOrderId when modal closes
    // setSelectedOrderId(null);
  };

  const closeToast = () => setToast(null);

  // Delete
  const handleDelete = async (id: number) => {
    console.log("Menghapus Order dengan ID:", id); // Debug

    try {
      const token = localStorage.getItem("token");

      await axiosInstance.delete(`http://localhost:2000/order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems((prev) => prev.filter((order) => order.id !== id));
      setToast({ type: "success", message: "Order berhasil Dihapus." });
    } catch (error: any) {
      console.log("Gagal menghapus Order:", error.response?.data || error.message);
      setToast({ type: "error", message: "Gagal menghapus Order." });
    }
  };



  return (
    <>
      {/* Search & Button */}
      <div className="flex justify-between items-center w-full mb-4">
        <form className="w-full max-w-md" onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-6 py-3 shadow focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
              aria-label="search-icon"
            >
              <MagnifyingGlassCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </form>

        <button
          onClick={openModal}
          className="ml-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Buat Order Baru
        </button>
        <OrderForm
          isOpen={isModalOpen}
          onClose={closeModal}
          currentUserId={currentUserId}
          mode="create" // opsional, default-nya create
          onAddOrder={(order: any) => {
            setItems((prev) => [...prev, order]);
            setToast({ type: "success", message: "Order berhasil ditambahkan." });
          }}
        />
        {/* <OrderForm
          isOpen={isModalOpen}
          onClose={closeModal}
          currentUserId={currentUserId}
          onAddOrder={(order: any) => {
            setItems((prev) => [...prev, order]);
            setToast({ type: "success", message: "Order berhasil ditambahkan." });
          }}
        /> */}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/70">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableCell isHeader>No</TableCell>
                  <TableCell isHeader>No SPB</TableCell>
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Tujuan</TableCell>
                  <TableCell isHeader>Jemput</TableCell>
                  <TableCell isHeader>Pembayaran</TableCell>
                  <TableCell isHeader>Tanggal</TableCell>
                  <TableCell isHeader>Total</TableCell>
                  <TableCell isHeader>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(items) && items.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.no_spb ? item.no_spb : "Customer"}</TableCell>
                    <TableCell>
                      {item.user?.role === "staff" ? item.customer : item.user?.name || "-"}
                    </TableCell>
                    <TableCell>{item.tujuan}</TableCell>
                    <TableCell>{item.jemput ? item.jemput : "Ambil Sendiri"}</TableCell>
                    <TableCell>{item.pembayaran}</TableCell>
                    <TableCell>{new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}</TableCell>
                    <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.total)}</TableCell>
                    <TableCell>
                      <button
                        className="bg-green-600 hover:bg-blue-700 text-white hover:underline py-1 px-3 rounded"
                        onClick={() => { setSelectedOrder(item); openEditModal(); }}
                      >
                        <RefreshCw size={20} />
                      </button>
                      <button
                        className="ml-2 bg-red-600 text-white text-white py-1 px-3 rounded hover:underline"
                        onClick={() => {
                          if (confirm("Yakin ingin menghapus order ini?")) {
                            handleDelete(item.id);
                          }
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        className="ml-2 bg-blue-600 text-white text-white py-1 px-3 rounded hover:underline"
                        onClick={() => handleOpenOrderInfo(item.id)}
                      >
                        <Info size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation" className="flex justify-center mt-6">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight 
              text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-e-0 
              border-gray-300 dark:border-gray-700 rounded-s-lg hover:bg-gray-100 
              dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
          </li>

          {Array.from({ length: Math.ceil(total / perPage) }, (_, index) => (
            <li key={index}>
              <button
                onClick={() => setPage(index + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === index + 1
                  ? "text-blue-600 border-gray-300 bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                  }`}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => {
                const maxPage = Math.ceil(total / perPage);
                if (page < maxPage) setPage(page + 1);
              }}
              disabled={page >= Math.ceil(total / perPage)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 
              dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 
              dark:border-gray-700 rounded-e-lg hover:bg-gray-100 dark:hover:bg-gray-700 
              disabled:opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Update Modal hanya dirender sekali */}
      <OrderForm
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        currentUserId={currentUserId}
        mode="edit"
        existingOrder={selectedOrder}
        onAddOrder={(updatedOrder: any) => {
          setItems((prev) =>
            prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
          );
          setToast({ type: "success", message: "Order berhasil diupdate." });
        }}
      />
      {/* <UpdateOrderForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateOrder={handleUpdateOrder}
        order={selectedOrder}
      /> */}

      <OrderInfo
        isOpen={isOrderInfoOpen}
        onClose={handleCloseOrderInfo}
        orderId={selectedOrderId}
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={closeToast} />
      )}
    </>
  );
}
