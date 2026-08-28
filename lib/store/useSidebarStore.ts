/**
 * @file lib/store/useSidebarStore.ts
 * @description Condition state management store for controlling the visibility and mutual exclusion of navigation and members sidebars.
 */

import { create } from "zustand";

/**
 * Interface representing the state and actions of the sidebar store.
 *
 * @interface SidebarState
 * @property {boolean} isNavOpen - Indicates whether the navigation sidebar is open.
 * @property {boolean} isMembersOpen - Indicates whether the members list sidebar is open.
 * @property {() => void} toggleNav - Toggles the navigation sidebar while automatically closing the members sidebar.
 * @property {() => void} toggleMembers - Toggles the members sidebar while automatically closing the navigation sidebar.
 * @property {() => void} closeAll - Closes both the navigation and members sidebars simultaneously.
 */
interface SidebarState {
  isNavOpen: boolean;
  isMembersOpen: boolean;
  toggleNav: () => void;
  toggleMembers: () => void;
  closeAll: () => void;
}

/**
 * Custom Condition hook for managing global sidebar visibility states.
 *
 * @returns {SidebarState} The current sidebar state and action handlers.
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  isNavOpen: false,
  isMembersOpen: false,
  toggleNav: () =>
    set((state) => ({ isNavOpen: !state.isNavOpen, isMembersOpen: false })),
  toggleMembers: () =>
    set((state) => ({ isMembersOpen: !state.isMembersOpen, isNavOpen: false })),
  closeAll: () => set({ isNavOpen: false, isMembersOpen: false }),
}));
