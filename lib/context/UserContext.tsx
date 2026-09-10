/**
 * @file lib/context/UserContext.tsx
 * @description Context provider and hook for managing current user data and friendship states.
 */

"use client";

import { createContext, useContext } from "react";
import type { User } from "@/db/schema";

/** Represents a friendship record between two users. */
interface Friendship {
  senderId: string;
  receiverId: string;
  status: string;
}

/** Shape of the user context value. */
interface UserContextType {
  currentUser: User;
  friendships: Friendship[];
}

const UserContext = createContext<UserContextType | null>(null);

/** Provides user data and friendship states to child components. */
export function UserProvider({
  children,
  currentUser,
  friendships,
}: {
  children: React.ReactNode;
  currentUser: User;
  friendships: Friendship[];
}) {
  return (
    <UserContext.Provider value={{ currentUser, friendships }}>
      {children}
    </UserContext.Provider>
  );
}

/** Custom hook to consume user context data. */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
