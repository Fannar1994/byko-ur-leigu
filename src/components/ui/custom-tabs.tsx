
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomTabProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomTab: React.FC<CustomTabProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
