/**
 * @file lib/context/UserContext.tsx
 * @description Context provider and hook for managing current user data and friendship states.
 */

"use client";

import { createContext, useContext, useState } from "react";
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
  updateCurrentUser: (partialUser: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | null>(null);

/** Provides user data and friendship states to child components. */
export function UserProvider({
  children,
  currentUser: initialUser,
  friendships,
}: {
  children: React.ReactNode;
  currentUser: User;
  friendships: Friendship[];
}) {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  /** Updates local current user state dynamically. */
  const updateCurrentUser = (partialUser: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...partialUser }));
  };

  return (
    <UserContext.Provider
      value={{ currentUser, friendships, updateCurrentUser }}
    >
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
