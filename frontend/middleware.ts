import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define role-based routes
const roleBasedRoutes = {
    admin: ['/admin', '/admin/*'],
    staff: ['/staff', '/staff/*'],
    customer: ['/dashboard', '/dashboard/*']
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    // Skip untuk public routes
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
        return NextResponse.next();
    }

    // Check authentication
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const userRole = decoded.role;

        // Check role-based access
        for (const [role, routes] of Object.entries(roleBasedRoutes)) {
            for (const route of routes) {
                if (pathname.match(new RegExp(`^${route.replace('*', '.*')}$`))) {
                    if (userRole !== role) {
                        // Redirect ke halaman forbidden atau home
                        return NextResponse.redirect(new URL('/forbidden', request.url));
                    }
                }
            }
        }

        return NextResponse.next();
    } catch (error) {
        // Token invalid
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};