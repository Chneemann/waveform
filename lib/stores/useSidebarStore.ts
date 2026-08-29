/**
 * @file lib/stores/useSidebarStore.ts
 * @description State management store using Zustand for controlling the visibility of navigation and members sidebars.
 */

import { create } from "zustand";

/**
 * Interface representing the state and actions of the sidebar store.
 *
 * @interface SidebarState
 * @property {boolean} isNavOpen - Indicates whether the navigation sidebar is open.
 * @property {boolean} isMembersOpen - Indicates whether the members list sidebar is open.
 * @property {() => void} toggleNav - Toggles the visibility of the navigation sidebar.
 * @property {() => void} toggleMembers - Toggles the visibility of the members list sidebar.
 * @property {() => void} closeNav - Explicitly closes the navigation sidebar.
 * @property {() => void} closeMembers - Explicitly closes the members list sidebar.
 * @property {() => void} closeAll - Closes both the navigation and members sidebars simultaneously.
 */
interface SidebarState {
  isNavOpen: boolean;
  isMembersOpen: boolean;
  toggleNav: () => void;
  toggleMembers: () => void;
  closeNav: () => void;
  closeMembers: () => void;
  closeAll: () => void;
}

/**
 * Custom Zustand hook for managing global sidebar visibility states.
 *
 * @returns {SidebarState} The current sidebar state and action handlers.
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  isNavOpen: true,
  isMembersOpen: false,
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  toggleMembers: () =>
    set((state) => ({ isMembersOpen: !state.isMembersOpen })),
  closeNav: () => set({ isNavOpen: false }),
  closeMembers: () => set({ isMembersOpen: false }),
  closeAll: () => set({ isNavOpen: false, isMembersOpen: false }),
}));
