## @hlth/web [0.4.3](https://github.com/koelnr/hlth/compare/@hlth/web@0.4.2...@hlth/web@0.4.3) (2026-04-17)


### Bug Fixes

* **app:** formmating and linting errors ([6516030](https://github.com/koelnr/hlth/commit/6516030c53c78a6667155743be6a7abec85f071c))
* **app:** replace undefined with null in models ([f59bb05](https://github.com/koelnr/hlth/commit/f59bb052e8f6b47a55af5c1c8e2e27f8f1128852))

## @hlth/web [0.4.2](https://github.com/koelnr/hlth/compare/@hlth/web@0.4.1...@hlth/web@0.4.2) (2026-04-16)


### Bug Fixes

* **app:** update org switcher and brand name ([e3e920c](https://github.com/koelnr/hlth/commit/e3e920c3ee0989d60a256b773a6be4d7a2a55eb9))

## @hlth/web [0.4.1](https://github.com/koelnr/hlth/compare/@hlth/web@0.4.0...@hlth/web@0.4.1) (2026-04-16)


### Bug Fixes

* **app:** remove redirect login from protected layout ([e7d2d3e](https://github.com/koelnr/hlth/commit/e7d2d3e961cc9b555a7589c885abfc1af0a6b196))
* **app:** show org name instead of slug on app sidebar and header ([21b0578](https://github.com/koelnr/hlth/commit/21b05788fba4926690c087515cd79c74462b822b))

# @hlth/web [0.4.0](https://github.com/koelnr/hlth/compare/@hlth/web@0.3.1...@hlth/web@0.4.0) (2026-04-16)


### Bug Fixes

* **auth:** move auth pages to auth group ([888fffd](https://github.com/koelnr/hlth/commit/888fffdf98dd34586cbd07b2f9b97c7c4a460a4f))
* **middleware:** migrate from middleware.ts to proxy.ts ([ff8c80d](https://github.com/koelnr/hlth/commit/ff8c80da3d8524b443a18b14323335a9b24ed5f2))


### Features

* **app:** add create forms and server actions for patients, appointments, and follow-ups ([83e4cd7](https://github.com/koelnr/hlth/commit/83e4cd7cc82f5cfed6086cdcc2b667f4cfbba93a))
* **app:** add per-route loading skeletons ([1cb1d67](https://github.com/koelnr/hlth/commit/1cb1d678d62dae0bb0db51a95abc090b462bdbcb))
* **app:** add shared app shell components ([9eaf6e8](https://github.com/koelnr/hlth/commit/9eaf6e8ac5e15977a932c25c7356142791c8b1e7))
* **app:** wire action buttons and resolve patient names across all list pages ([8ad4118](https://github.com/koelnr/hlth/commit/8ad4118cd9f3b5a4c6b252d3a3841dce81f11cca))

## @hlth/web [0.3.1](https://github.com/koelnr/hlth/compare/@hlth/web@0.3.0...@hlth/web@0.3.1) (2026-04-16)


### Bug Fixes

* **data:** harden multi-tenant foundation against tenancy bypass and unsafe patterns ([5862759](https://github.com/koelnr/hlth/commit/58627599dc04efe33ef92bd3b6faf9848695aa68))

# @hlth/web [0.3.0](https://github.com/koelnr/hlth/compare/@hlth/web@0.2.2...@hlth/web@0.3.0) (2026-04-16)


### Features

* **auth:** add clerk server-side auth helpers and viewer context ([52167cd](https://github.com/koelnr/hlth/commit/52167cd70b4f6c55fb53c90adcef8c46a8c437e3))
* **data:** add multi-tenant data models and firestore repositories ([10d2506](https://github.com/koelnr/hlth/commit/10d2506da158201267ac423e5d0d7746fdd110e2))
* **firebase:** add admin SDK, client SDK, collections, and storage helpers ([e565279](https://github.com/koelnr/hlth/commit/e565279a4663b0b4e422506649afed794afa7093))
* **middleware:** enforce clerk auth on all non-public routes ([d58dbb0](https://github.com/koelnr/hlth/commit/d58dbb0f8860096bfc6184aaec41a616187ed55c))

## @hlth/web [0.2.2](https://github.com/koelnr/hlth/compare/@hlth/web@0.2.1...@hlth/web@0.2.2) (2026-04-15)


### Bug Fixes

* **web:** align waitlist page heading with new CTA language ([be18112](https://github.com/koelnr/hlth/commit/be18112099855dfe902b84bf51a2fe23f416436d))
* **web:** sharpen marketing copy for clinic owner conversion ([c9080c0](https://github.com/koelnr/hlth/commit/c9080c0b338bd139f69fc8893566090599ea9448))

## @hlth/web [0.2.1](https://github.com/koelnr/hlth/compare/@hlth/web@0.2.0...@hlth/web@0.2.1) (2026-04-15)


### Bug Fixes

* **web:** remove confirmed waitlist page and remove styling from waitlist component ([b846899](https://github.com/koelnr/hlth/commit/b846899ae2e3c99692ef5c8c34a4031bf1720653))

# @hlth/web [0.2.0](https://github.com/koelnr/hlth/compare/@hlth/web@0.1.0...@hlth/web@0.2.0) (2026-04-15)


### Features

* **web:** add sign-in and sign-up pages ([9e4e7e8](https://github.com/koelnr/hlth/commit/9e4e7e8f5dd9280dc2cb6206320917b09d83b249))
* **web:** add waitlist page and confirmation screen ([376e901](https://github.com/koelnr/hlth/commit/376e9015e7a64b7b87ea3f76a906ea4e93005a34))
* **web:** configure Clerk provider and middleware ([995e2bf](https://github.com/koelnr/hlth/commit/995e2bf04208eefe61702b6b02d6b504cafc9e34))
* **web:** wire all CTA buttons to waitlist route ([13604ee](https://github.com/koelnr/hlth/commit/13604ee004fab6979d42d68a63401a26f7e15100))

# @hlth/web [0.1.0](https://github.com/koelnr/hlth/compare/@hlth/web@0.0.1...@hlth/web@0.1.0) (2026-04-15)


### Features

* **web:** add landing page content config ([b3cd84a](https://github.com/koelnr/hlth/commit/b3cd84a5999f082f52acc52569cbd046b0bdc917))
* **web:** add marketing section components and shadcn ui primitives ([1827ece](https://github.com/koelnr/hlth/commit/1827ecef2a01393e5be28af722dc3ddd5a40860e))
* **web:** wire marketing page and update app metadata ([76bac80](https://github.com/koelnr/hlth/commit/76bac802ff01237503bf2854ab9c517515d3b6ec))

## @hlth/web [0.0.1](https://github.com/koelnr/hlth/compare/@hlth/web@0.0.0...@hlth/web@0.0.1) (2026-04-15)


### Bug Fixes

* web app package name ([09befa8](https://github.com/koelnr/hlth/commit/09befa83288f704ad7207179b7b6c479a0213cad))

# @hlth/web 1.0.0 (2026-04-15)


### Bug Fixes

* web app package name ([09befa8](https://github.com/koelnr/hlth/commit/09befa83288f704ad7207179b7b6c479a0213cad))
