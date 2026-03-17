import { Routes } from '@angular/router';

import { Home } from '#features/home/home';
import { SightingsMap } from '#features/sightings-map/sightings-map';
import { Login } from '#features/auth/login/login';
import { Signup } from '#features/auth/signup/signup';
import { SightingDetails } from '#features/sighting-details/sighting-details';
import { authGuard } from '#core/guards/auth/auth-guard';
import { guestGuard } from '#core/guards/guest/guest-guard';

export const routes: Routes = [
  {
    path: 'home',
    title: "Webtech's Streetcats",
    component: Home
  },
  {
    path: 'log-in',
    title: "Log In",
    component: Login,
    canMatch: [guestGuard] // Redirect to /home if already logged in
  },
  {
    path: 'sign-up',
    title: "Sign Up",
    component: Signup,
    canMatch: [guestGuard] // Redirect to /home if already logged in
  },
  {
    path: 'profile',
    title: "Profile",
    component: Home,
    canMatch: [authGuard] // Redirect to /log-in if not logged in
  },
  {
    path: 'my-sightings',
    title: "My Sightings",
    component: Home,
    canMatch: [authGuard] // Redirect to /log-in if not logged in
  },
  {
    path: 'settings',
    title: "Settings",
    component: Home,
    canMatch: [authGuard] // Redirect to /log-in if not logged in
  },
  {
    path: 'sightings-map',
    title: "Sightings Map",
    component: SightingsMap
  },
  {
    path: 'sightings/:id',
    title: "Sighting Details",
    component: SightingDetails
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];