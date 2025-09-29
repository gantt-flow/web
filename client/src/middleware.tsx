// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuración de rutas protegidas y roles permitidos
const protectedRoutes: { [key: string]: string[] } = {
  // Rutas de Administrador de Sistema
  '/admin/sistema/usuarios': ['Administrador de sistema'],
  '/admin/proyectos/permisos': ['Administrador de sistema'],
  
  // Rutas de Auditor (puede acceder a auditoría)
  '/admin/sistema/auditoria': ['Administrador de sistema', 'Auditor'],
};

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/auth/login', '/unauthorized', '/accept-invite','/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Obtener el token de la cookie
  const token = request.cookies.get('token')?.value;

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decodificar el token JWT (sin verificar la firma, solo para obtener el payload)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    
    const user = payload.user;
    if (!user || !user.role) {
      throw new Error('Token inválido');
    }

    // Verificar si la ruta actual requiere un rol específico
    const requiredRoute = Object.keys(protectedRoutes).find(route => 
      pathname.startsWith(route)
    );

    // Si la ruta no está en protectedRoutes, permitir acceso (rutas no protegidas)
    if (!requiredRoute) {
      return NextResponse.next();
    }

    // Verificar si el usuario tiene el rol requerido
    const allowedRoles = protectedRoutes[requiredRoute];
    if (!allowedRoles.includes(user.role)) {
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Usuario autorizado, permitir acceso
    return NextResponse.next();

  } catch (error) {
    // Token inválido, limpiar cookie y redirigir al login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};