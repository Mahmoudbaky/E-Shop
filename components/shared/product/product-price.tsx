import React from "react";
import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  // Ensure tow decimal  places
  const stringValue = value.toFixed(2);
  // get the int/float
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-sm align-super">$</span>
      {intValue}
      <span className="text-sm align-super">{floatValue}</span>
    </p>
  );
};

export default ProductPrice;

/// .toFixed is a js function
// align-super
