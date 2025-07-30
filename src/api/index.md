---
layout: base.njk
title: JSON API
category: Meta
tags:
  - api
  - overview
last_updated: 2025-07-27
---

SWGDB exposes a small JSON API for programmatic access to select site data. Each endpoint returns an array of objects used to build the related pages.

## Available Endpoints

- [/api/professions.json](/api/professions.json) - Raw profession metadata including title, category, tags, URL, and last updated date.
- [/api/quests.json](/api/quests.json) - Processed quest information with the same fields as above.

These files are generated at build time and excluded from navigation and search results.
