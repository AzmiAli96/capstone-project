import ComponentCard from "@/components/Common/ComponentCard";
import ProfileAdministrator from "@/components/Context/Profile";

export default function ProfilePage() {
    
    return (
        <div className="space-y-6">
            <ComponentCard title="Profile Administrator">
                <ProfileAdministrator />
            </ComponentCard>
        </div>
    );
}