import { Routes } from '@angular/router';

import { Home } from './home/home';
import { SightingsMap } from './sightings-map/sightings-map';
import { Example } from './example/example';

export const routes: Routes = [
    {
       path: '',
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
    }
];
