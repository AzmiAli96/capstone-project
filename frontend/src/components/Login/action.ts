'use server';

import { cookies } from 'next/headers';

export const loginAction = async (token: string) => {
  (await cookies()).set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60, // 1 jam
  });
};