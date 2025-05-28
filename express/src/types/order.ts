export interface orderData {
    no_spb: string;
    customer?: string;
    berat: number;
    koli: number;
    pembayaran: string;
    jemput?: string;
    tujuan: string;
    total?: number;
    ket: string;
    image: string;
    tanggal: string | Date;
    id_user?: number;
    id_wilayah: number;
    id_ongkos?: number;
}