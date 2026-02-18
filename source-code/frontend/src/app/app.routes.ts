import { Routes } from '@angular/router';

import { Home } from '#features/home/home';
import { SightingsMap } from '#features/sightings-map/sightings-map';
import { Example } from '#features/example/example';

export const routes: Routes = [
    {
       path: 'home',
       title: "Webtech's Streetcats",
       component: Home
    },
    {
       path: 'sightings-map',
       title: "Sightings Map",
       component: SightingsMap
    },
    {
       path: 'example',
       title: "Example",
       component: Example
    },
    {
      path: '**',
      redirectTo: '/home'
    }
];
