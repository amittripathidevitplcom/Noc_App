import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private keyPromise: Promise<CryptoKey>;

  constructor() {
    // Generate or retrieve the AES key
    this.keyPromise = this.generateKey();
  }

  // Generate a secure AES-GCM key (256-bit)
  private async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // URL-safe Base64 encode (no +, /, =)
  private base64UrlEncode(buffer: ArrayBuffer): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Decode URL-safe Base64 back to ArrayBuffer
  private base64UrlDecode(base64Url: string): ArrayBuffer {
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      + '==='.slice((base64Url.length + 3) % 4); // padding

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // 🔐 Encrypt a string to a slash-free, URL-safe format
  async encrypt(plainText: string): Promise<string> {
    const key = await this.keyPromise;
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM IV
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const ivEncoded = this.base64UrlEncode(iv.buffer);
    const dataEncoded = this.base64UrlEncode(encrypted);

    return `${ivEncoded}.${dataEncoded}`;
  }

  // 🔓 Decrypt back to original string

  async decrypt(encryptedText: string): Promise<string> {
    const key = await this.keyPromise;
    const [ivEncoded, dataEncoded] = encryptedText.split('.');

    const iv = new Uint8Array(this.base64UrlDecode(ivEncoded));
    const encryptedData = this.base64UrlDecode(dataEncoded);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );


    return new TextDecoder().decode(decrypted);
  }
}
