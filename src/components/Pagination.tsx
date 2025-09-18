import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <ToggleGroup
        type="single"
        value={String(currentPage)}
        onValueChange={(val) => {
          if (val) onPageChange(Number(val));
        }}
        className="flex gap-1"
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <ToggleGroupItem
            key={page}
            value={String(page)}
            aria-label={`Page ${page}`}
            className="w-9 h-9 text-sm"
          >
            {page}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
