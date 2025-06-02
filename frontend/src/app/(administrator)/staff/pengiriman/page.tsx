import ComponentCard from "@/components/Common/ComponentCard";
import Allorder from "@/components/Staff/order";

export default function Ecommerce() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Table Order / pengiriman">
                <Allorder />
            </ComponentCard>
        </div>
    );
}