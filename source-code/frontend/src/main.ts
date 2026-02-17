/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import * as L from 'leaflet';

import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

// Fix Leaflet icons for Angular
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
  iconUrl: '/assets/leaflet/marker-icon.png',
  shadowUrl: '/assets/leaflet/marker-shadow.png',
});