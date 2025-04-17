
import { RentalItem } from '@/types/contract';

interface UseTabContentProps {
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
  showContractColumn?: boolean;
  onItemCountChange?: (itemId: string, count: number) => void;
  showProject?: boolean;
}

export function useTabContent({
  items,
  contractNumbers,
  showActions,
  onOffHireClick,
  processingItemId,
  onTogglePicked,
  pickedItems,
  showContractColumn,
  onItemCountChange,
  showProject
}: UseTabContentProps) {
  // Organize props for ItemTable to make them more manageable
  const tableProps = {
    items,
    contractNumbers,
    showActions,
    onOffHireClick,
    processingItemId,
    onTogglePicked,
    pickedItems,
    showContractColumn,
    onItemCountChange,
    showProject
  };

  return { tableProps };
}
