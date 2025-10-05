import { AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";

interface SCPHeaderProps {
  classification: "EUCLID" | "KETER" | "SAFE" | "THAUMIEL" | "APOLLYON";
  itemNumber?: string;
  title: string;
}

export const SCPHeader = ({ classification, itemNumber, title }: SCPHeaderProps) => {
  const getClassColor = (cls: string) => {
    switch (cls) {
      case "SAFE":
        return "bg-success/20 text-success border-success";
      case "EUCLID":
        return "bg-yellow-600/20 text-yellow-700 border-yellow-700";
      case "KETER":
        return "bg-destructive/20 text-destructive border-destructive";
      case "THAUMIEL":
        return "bg-purple-600/20 text-purple-700 border-purple-700";
      case "APOLLYON":
        return "bg-black/90 text-white border-black";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="scp-paper border-2 border-border p-6 mb-6">
      <div className="classification-bar mb-4"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-bold scp-header">
            {itemNumber && <span className="text-scp-red">{itemNumber}</span>}
            {itemNumber && " - "}
            {title}
          </h1>
        </div>
        <Badge 
          variant="outline" 
          className={`scp-stamp text-lg px-4 py-2 ${getClassColor(classification)}`}
        >
          {classification}
        </Badge>
      </div>

      <div className="classification-bar"></div>

      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-mono">
        <div className="flex justify-between">
          <span>SCP Foundation Database</span>
          <span>Clearance Level: ████</span>
        </div>
      </div>
    </div>
  );
};
