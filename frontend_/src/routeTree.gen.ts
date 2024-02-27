/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as PrivateImport } from './routes/_private'
import { Route as IndexImport } from './routes/index'
import { Route as PublicLoginImport } from './routes/_public/login'
import { Route as PrivateSettingsIndexImport } from './routes/_private/settings/index'
import { Route as PrivateScoreboardIndexImport } from './routes/_private/scoreboard/index'
import { Route as PrivateResultsIndexImport } from './routes/_private/results/index'
import { Route as PrivateRankingIndexImport } from './routes/_private/ranking/index'
import { Route as PrivateInfoIndexImport } from './routes/_private/info/index'
import { Route as PrivateResultsRunIdImport } from './routes/_private/results/$runId'

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const PrivateRoute = PrivateImport.update({
  id: '/_private',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PublicLoginRoute = PublicLoginImport.update({
  path: '/login',
  getParentRoute: () => PublicRoute,
} as any)

const PrivateSettingsIndexRoute = PrivateSettingsIndexImport.update({
  path: '/settings/',
  getParentRoute: () => PrivateRoute,
} as any)

const PrivateScoreboardIndexRoute = PrivateScoreboardIndexImport.update({
  path: '/scoreboard/',
  getParentRoute: () => PrivateRoute,
} as any)

const PrivateResultsIndexRoute = PrivateResultsIndexImport.update({
  path: '/results/',
  getParentRoute: () => PrivateRoute,
} as any)

const PrivateRankingIndexRoute = PrivateRankingIndexImport.update({
  path: '/ranking/',
  getParentRoute: () => PrivateRoute,
} as any)

const PrivateInfoIndexRoute = PrivateInfoIndexImport.update({
  path: '/info/',
  getParentRoute: () => PrivateRoute,
} as any)

const PrivateResultsRunIdRoute = PrivateResultsRunIdImport.update({
  path: '/results/$runId',
  getParentRoute: () => PrivateRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_private': {
      preLoaderRoute: typeof PrivateImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_public/login': {
      preLoaderRoute: typeof PublicLoginImport
      parentRoute: typeof PublicImport
    }
    '/_private/results/$runId': {
      preLoaderRoute: typeof PrivateResultsRunIdImport
      parentRoute: typeof PrivateImport
    }
    '/_private/info/': {
      preLoaderRoute: typeof PrivateInfoIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_private/ranking/': {
      preLoaderRoute: typeof PrivateRankingIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_private/results/': {
      preLoaderRoute: typeof PrivateResultsIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_private/scoreboard/': {
      preLoaderRoute: typeof PrivateScoreboardIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_private/settings/': {
      preLoaderRoute: typeof PrivateSettingsIndexImport
      parentRoute: typeof PrivateImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  PrivateRoute.addChildren([
    PrivateResultsRunIdRoute,
    PrivateInfoIndexRoute,
    PrivateRankingIndexRoute,
    PrivateResultsIndexRoute,
    PrivateScoreboardIndexRoute,
    PrivateSettingsIndexRoute,
  ]),
  PublicRoute.addChildren([PublicLoginRoute]),
])

/* prettier-ignore-end */
