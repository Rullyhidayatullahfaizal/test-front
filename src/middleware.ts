import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Tentukan jalur yang perlu dicek apakah pengguna sudah login
  const protectedPaths = ['/dashboard', '/ai', '/forms', '/tables'];

  // Periksa apakah pengguna mengakses salah satu jalur yang dilindungi
  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.rewrite(new URL('/login', request.url));
    }
  }

  // Lanjutkan jika pengguna sudah login atau mengakses halaman lain
  return NextResponse.next();
}
