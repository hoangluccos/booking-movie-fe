import { Card, Statistic } from "antd";
import { ReactNode } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

interface StatisticComponentProps {
  total: number;
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  isCurrency?: boolean;
}

const StatisticComponent = (props: StatisticComponentProps) => {
  const { total, title, icon, iconBgColor, isCurrency = false } = props;

  return (
    <Card className="w-[300px] h-[150px] bg-[#273142] rounded-xl shadow-lg border-none px-2 py-2">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div>
            <Statistic
              title={
                <span className="text-white text-base font-medium font-saira">
                  {title}
                </span>
              }
              value={total}
              formatter={(value) => (
                <span className="text-white font-semibold font-saira text-[28px] leading-tight">
                  {typeof value === "number" && isCurrency
                    ? value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : value}
                </span>
              )}
            />
          </div>
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ backgroundColor: iconBgColor }}
          >
            <span className="text-white text-xl">{icon}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticComponent;
