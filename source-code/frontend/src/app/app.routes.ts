import { Routes } from '@angular/router';

import { Home } from '#features/home/home';
import { SightingsMap } from '#features/sightings-map/sightings-map';
import { Login } from '#features/auth/login/login';
import { Signup } from '#features/auth/signup/signup';
import { SightingDetails } from '#features/sighting-details/sighting-details';

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
    path: 'profile',
    title: "Profile",
    component: Home
  },
  {
    path: 'my-sightings',
    title: "My Sightings",
    component: Home
  },
  {
    path: 'sightings/:id',
    title: "Sighting Details",
    component: SightingDetails
  },
  {
    path: 'sightings/:id/edit',
    title: "Sighting Edit",
    component: Home
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
