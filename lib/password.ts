/**
 * @file lib/password.ts
 * @description Utility functions for securely hashing and verifying passwords using bcryptjs.
 */

import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password using bcrypt with a salt round factor of 10.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the generated password hash string.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compares a plain text password against a stored bcrypt hash to verify its validity.
 *
 * @param {string} password - The plain text password to verify.
 * @param {string} hash - The bcrypt hash to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hash, or false otherwise.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
