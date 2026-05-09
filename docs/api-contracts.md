# PlanMyDay — API Contracts

Minimal contract covering the full MVP spec. Whether implemented as an Express
proxy in front of Overpass/Nominatim or as direct browser calls, the
consumer-facing shape stays the same.

## Endpoints

### 1. `GET /activities` — Search nearby activities

Query params:

| name | type | required | notes |
|---|---|---|---|
| `lat` | number | yes | user location |
| `lng` | number | yes | user location |
| `radius_mi` | number | no | default `5`, allowed `1 \| 5 \| 10 \| 25` |
| `interests` | string | yes | comma-separated category ids, e.g. `outdoors,food,arts` |
| `open_now` | bool | no | default `false` |
| `limit` | number | no | default `20`, max `50` |
| `cursor` | string | no | opaque pagination token for "Load more" |

Response `200`:

```json
{
  "results": [
    {
      "id": "osm:node:1234567",
      "name": "Prospect Park Loop",
      "category": "outdoors",
      "category_label": "Park",
      "distance_mi": 0.4,
      "score": 0.96,
      "open_now": true,
      "website": "prospectpark.org",
      "location": { "lat": 40.6602, "lng": -73.9690 },
      "address": "Prospect Park, Brooklyn, NY",
      "hours_raw": "Mo-Su 06:00-21:00"
    }
  ],
  "next_cursor": "abc123",
  "total_estimate": 20
}
```

Errors: `400` invalid params, `502` Overpass upstream failure, `504` Overpass
timeout.

Notes:

- `score ∈ [0, 1]` — tag-match ratio between the activity's OSM tags and the
  user's selected interests' tags.
- `distance_mi` computed from request `lat/lng` via Haversine.
- `open_now` may be `null` when OSM has no `opening_hours` for the place.
- Default sort: `score` desc, then `distance_mi` asc.
- Frontend converts `location` → Leaflet pixel pins; the API does not return
  pre-projected coordinates.

### 2. `GET /geocode` — Forward geocoding (manual location input)

Query params: `q` (string, required), `limit` (number, default `5`).

Response `200`:

```json
{
  "results": [
    {
      "name": "Park Slope",
      "detail": "Brooklyn, NY, USA",
      "location": { "lat": 40.6710, "lng": -73.9814 }
    }
  ]
}
```

### 3. `GET /reverse-geocode` — Coordinates → human-readable label

Used by the results toolbar pill (e.g. "Park Slope, Brooklyn").

Query params: `lat`, `lng` (both required).

Response `200`:

```json
{ "name": "Park Slope", "detail": "Brooklyn, NY" }
```

## Not endpoints

- **Categories** — static config bundled with the frontend (`src/data/mockData.js`
  already holds it). No `/categories` route.
- **Auth, users, saved places, ratings** — explicit non-goals per the spec.

## Caching (only if a proxy is added)

| route | key | TTL |
|---|---|---|
| `/activities` | `(lat≈3dp, lng≈3dp, radius, sorted_interests, open_now)` | 10 min |
| `/geocode` | normalized `q` | 1 hr |
| `/reverse-geocode` | `(lat≈3dp, lng≈3dp)` | 1 hr |

In-memory LRU or Redis — no relational DB required.
