import { Routes } from '@angular/router';

import { Home } from '#features/home/home';
import { SightingsMap } from '#features/sightings-map/sightings-map';
import { Example } from '#features/example/example';
import { Login } from '#features/auth/login/login';
import { Signup } from '#features/auth/signup/signup';

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
       path: 'log-in',
       title: "Log In",
       component: Login
    },
    {
       path: 'sign-up',
       title: "Sign Up",
       component: Signup
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
