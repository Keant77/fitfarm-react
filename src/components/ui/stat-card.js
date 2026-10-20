
import * as React from "react";
import { Card, CardContent } from "./card";

const StatCard = React.memo(
  React.forwardRef(
    (
      {
        title,
        value,
        icon: Icon,
        type = "green",
        className = "",
        onDetail,
      },
      ref
    ) => {
        
      return (
        <Card
          ref={ref}
          className={`dashboard-card dashboard-card-${type} ${className}`}
        >
          <CardContent className="dashboard-card-content">
            <div className="dashboard-card-icon">
              {Icon && <Icon size={24} strokeWidth={2} />}
            </div>

            <div className="dashboard-card-info">
              <div className="dashboard-card-title">{title}</div>
              <div className="dashboard-number">{value}</div>
            </div>

            <button
              type="button"
              className="dashboard-card-arrow"
              aria-label={`Detail ${title}`}
              onClick={onDetail}
            >
              <span aria-hidden="true">›</span>
            </button>
          </CardContent>
        </Card>
      );
    }
  )
);

StatCard.displayName = "StatCard";

export { StatCard };
