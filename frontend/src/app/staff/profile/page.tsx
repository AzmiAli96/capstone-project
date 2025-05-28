import ComponentCard from "@/components/Common/ComponentCard";
import ProfileStaff from "@/components/Staff/Profile";

export default function Ecommerce() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Profile Staff">
                <ProfileStaff />
            </ComponentCard>
        </div>
    );
}