import ComponentCard from "@/components/Common/ComponentCard";
import Laporan from "@/components/Laporan";

export default function LaporanPage() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Laporan Keuangan">
                <Laporan />
            </ComponentCard>
        </div>
    );
}