import User from "@/components/Admin/User";
import ComponentCard from "@/components/Common/ComponentCard";

export default function userPage() {
    
    return (
        <div className="space-y-6 bg-white dark:bg-gray-900 p-6 min-h-screen">
            <ComponentCard title="User">
                <User />
            </ComponentCard>
        </div>
    );
}