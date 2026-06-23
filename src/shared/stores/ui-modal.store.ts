"use client";

import { create } from "zustand";

export type ModalMode = "admin" | "staff";

export type ModalName =
  | "createTable"
  | "editTable"
  | "deleteTable"
  | "createFloor"
  | "deleteFloor"
  | "createOrder"
  | "closeTable"
  | "orderDetails"
  | "createStaff"
  | "editStaff"
  | "deleteStaff"
  | "createMenuItem"
  | "editMenuItem"
  | "deleteMenuItem"
  | "createMenuCategory"
  | "editMenuCategory"
  | "deleteMenuCategory";

export type ModalPayload = {
  tableId?: string;
  orderId?: string;
  staffId?: string;
  floorId?: string;
  categoryId?: string;
  menuItemId?: string;
  mode?: ModalMode;
};

type ModalState = {
  open: boolean;
  payload?: ModalPayload;
};

type ModalRegistry = Partial<Record<ModalName, ModalState>>;

type UiModalStore = {
  modals: ModalRegistry;
  openModal: (name: ModalName, payload?: ModalPayload) => void;
  closeModal: (name: ModalName) => void;
  closeAllModals: () => void;
  isModalOpen: (name: ModalName) => boolean;
  getModalPayload: (name: ModalName) => ModalPayload | undefined;
};

export const useUiModalStore = create<UiModalStore>((set, get) => ({
  modals: {},
  openModal: (name, payload) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          open: true,
          payload,
        },
      },
    })),
  closeModal: (name) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          open: false,
        },
      },
    })),
  closeAllModals: () =>
    set((state) => ({
      modals: Object.fromEntries(
        Object.entries(state.modals).map(([name]) => [
          name,
          {
            open: false,
          },
        ]),
      ) as ModalRegistry,
    })),
  isModalOpen: (name) => get().modals[name]?.open ?? false,
  getModalPayload: (name) => get().modals[name]?.payload,
}));
