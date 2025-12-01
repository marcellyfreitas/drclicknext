// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
	const adminToken = req.cookies.get('admin-token')?.value;
	const userToken = req.cookies.get('user-token')?.value;

	const { pathname } = req.nextUrl;

	if (adminToken && pathname.startsWith('/authentication/admin/login')) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	if (userToken && pathname.startsWith('/authentication/user/login')) {
		return NextResponse.redirect(new URL('/usuario', req.url));
	}

	if (!adminToken && pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/authentication/admin/login', req.url));
	}

	if (!userToken && pathname.startsWith('/usuario')) {
		return NextResponse.redirect(new URL('/authentication/user/login', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/authentication/admin/login',
		'/authentication/user/login',
		'/usuario/:path*',
		'/dashboard/:path*',
	],
};
