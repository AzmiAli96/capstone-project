import Wilayah from "@/components/Admin/Wilayah";
import ComponentCard from "@/components/Common/ComponentCard";

export default function WilayahPage() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Wilayah Tujuan">
                <Wilayah />
            </ComponentCard>
        </div>
    );
}