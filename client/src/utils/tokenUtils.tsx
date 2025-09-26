// src/utils/tokenUtils.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export const decodeToken = (token: string): { user: User } | null => {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserFromToken = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.user || null;
};