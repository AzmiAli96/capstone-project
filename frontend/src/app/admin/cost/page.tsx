import Cost from "@/components/Admin/Ongkos";
import ComponentCard from "@/components/Common/ComponentCard";

export default function CostPage() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="User">
                <Cost />
            </ComponentCard>
        </div>
    );
}