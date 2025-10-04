import { ethers } from 'ethers';

/**
 * Generate a deterministic blockchain address for a user
 * Uses Ethereum-style keccak256 hashing and address formatting
 */
export function generateBlockchainAddress(userId: string, email: string): string {
  // Create a deterministic seed from user data
  const seed = `CTF_PLATFORM_${userId}_${email}_IDENTITY`;
  
  // Hash using keccak256 (Ethereum standard)
  const hash = ethers.keccak256(ethers.toUtf8Bytes(seed));
  
  // Take last 20 bytes (40 hex chars) to create Ethereum-style address
  // Ethereum addresses are 20 bytes (40 hex chars) with 0x prefix
  const address = '0x' + hash.slice(-40);
  
  return address;
}

/**
 * Generate a blockchain signature for verification
 * Creates a cryptographic proof of identity
 */
export function generateIdentitySignature(userId: string, address: string, timestamp: number): string {
  const message = `CTF Identity Verification\nUser: ${userId}\nAddress: ${address}\nTimestamp: ${timestamp}`;
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  return messageHash;
}

/**
 * Verify blockchain address format
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Truncate blockchain address for display
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Get blockchain explorer link (for display purposes)
 */
export function getExplorerLink(address: string): string {
  return `https://etherscan.io/address/${address}`;
}
