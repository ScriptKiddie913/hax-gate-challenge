import { ethers } from 'ethers';

export interface BlockchainIdentity {
  address: string;
  signature: string;
  message: string;
}

/**
 * Generate a unique message for the user to sign
 */
export function generateSignatureMessage(userId: string, username: string): string {
  const timestamp = Date.now();
  return `CTF Platform Identity Verification\n\nUser ID: ${userId}\nUsername: ${username}\nTimestamp: ${timestamp}\n\nBy signing this message, you verify ownership of this blockchain address.`;
}

/**
 * Request user to connect their Ethereum wallet and sign a message
 */
export async function connectBlockchainIdentity(
  userId: string,
  username: string
): Promise<BlockchainIdentity> {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet to continue');
  }

  try {
    // Request account access
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }

    const address = accounts[0];
    const signer = await provider.getSigner();
    
    // Generate message to sign
    const message = generateSignatureMessage(userId, username);
    
    // Request signature
    const signature = await signer.signMessage(message);
    
    return {
      address,
      signature,
      message
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the signature request');
    }
    throw error;
  }
}

/**
 * Verify a blockchain signature (client-side verification)
 */
export async function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
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

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
