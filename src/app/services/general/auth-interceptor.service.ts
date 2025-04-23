import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('X-Skip-Auth')) {
    const newHeaders = req.headers.delete('X-Skip-Auth');
    return next(req.clone({ headers: newHeaders }));
  }

  const token = localStorage.getItem('tok');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};