import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key.
registerLicense('MzU5MEAzMjMwMkUzMTJFMzBUbmZOc1RiYkhhdkdjQTlUaTlYTkpOSkl3c3hTVDFYY0M4enBtOTEvMzdrPQ==');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
