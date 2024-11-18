import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { errorInterceptor } from './Interceptor/error.interceptor';
import { jwtInterceptor } from './Interceptor/jwt.interceptor';
import { loadingInterceptor } from './Interceptor/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor,loadingInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass : 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true,
    }),
    importProvidersFrom(NgxSpinnerModule)
  ],
};
