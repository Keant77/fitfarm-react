import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const StatCard = React.forwardRef(
  ({ title, value, className = "" }, ref) => {
    return (
      <Card
        ref={ref}
        className={`rounded-2xl border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#6B7280]">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold text-[#0F6D3A]">
            {value}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };