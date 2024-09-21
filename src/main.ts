import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
