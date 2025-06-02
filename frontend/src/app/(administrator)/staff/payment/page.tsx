import ComponentCard from "@/components/Common/ComponentCard";
import Allorder from "@/components/Staff/order";
import Payment from "@/components/Staff/payment";

export default function Ecommerce() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Table Payment / Status Pembayaran">
                <Payment />
            </ComponentCard>
        </div>
    );
}