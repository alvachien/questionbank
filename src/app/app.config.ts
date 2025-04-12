import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, provideAppInitializer, inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(), 
    provideHttpClient(),
    // provideAppInitializer(() => {
    //   const themeService = inject(ThemeService);
    //   themeService.loadTheme()
    // }), 
  ]
};
