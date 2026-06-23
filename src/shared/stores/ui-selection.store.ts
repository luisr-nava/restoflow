"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UiSelectionStore = {
  selectedFloorId: string | null;
  selectedTableId: string | null;
  selectedOrderId: string | null;
  selectedStaffId: string | null;
  setSelectedFloorId: (floorId: string | null) => void;
  setSelectedTableId: (tableId: string | null) => void;
  setSelectedOrderId: (orderId: string | null) => void;
  setSelectedStaffId: (staffId: string | null) => void;
  clearSelection: () => void;
};

export const useUiSelectionStore = create<UiSelectionStore>()(
  persist(
    (set) => ({
      selectedFloorId: null,
      selectedTableId: null,
      selectedOrderId: null,
      selectedStaffId: null,
      setSelectedFloorId: (selectedFloorId) => set({ selectedFloorId }),
      setSelectedTableId: (selectedTableId) => set({ selectedTableId }),
      setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),
      setSelectedStaffId: (selectedStaffId) => set({ selectedStaffId }),
      clearSelection: () =>
        set({
          selectedFloorId: null,
          selectedTableId: null,
          selectedOrderId: null,
          selectedStaffId: null,
        }),
    }),
    {
      name: "restoflow-ui-selection",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedFloorId: state.selectedFloorId,
      }),
    },
  ),
);
