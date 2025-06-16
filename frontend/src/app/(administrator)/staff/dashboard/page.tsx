import OrderChart from "@/components/Staff/dashboard/orderBulanan";
import MonthlySalesChart from "@/components/Staff/dashboard/orderBulanan";
import TargetStatus from "@/components/Staff/dashboard/target";
import { Count } from "@/components/Staff/dashboard/user";


export default function Ecommerce() {
  return (
    <div className="grid grid-co gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <Count />
        
        <TargetStatus/>

        <OrderChart />
      </div>
      {/*   
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

      {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

    </div>
  );
}
