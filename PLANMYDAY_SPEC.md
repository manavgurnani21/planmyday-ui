# Activity Planner App — MVP Requirements

## Core Flow
1. App opens with an interest selector (multi-select)
2. User confirms interests → app fetches nearby activities
3. Results displayed in map or list view (user toggleable)

## Data & Sources
| Source | Purpose | API Key Required |
|---|---|---|
| Overpass API (OpenStreetMap) | Activity data | No |
| Nominatim | Location search fallback | No |
| Leaflet.js + OSM tiles | Map rendering | No |
| Google Maps deep link | Directions | No |

## Activity Card
Each result displays the following:
- **Name**
- **Category/type**
- **Distance** from user
- **Interest alignment score** (tag-match based)
- **Website link** (when available)
- **Directions button** (deep links to Google Maps)

## Filters & Controls
- Search radius slider (1, 5, 10, 25 mi)
- Interest filter pills (post-load toggling)
- Open now toggle
- Result cap of 20, with load more

## Location
- Browser geolocation (default)
- Manual address/city input (fallback)

## Interest Categories
| Category | OSM Tags |
|---|---|
| Outdoors | park, hiking, nature_reserve, sports_centre |
| Food & Drink | restaurant, cafe, bar, food_court |
| Arts & Culture | museum, gallery, theatre, cinema |
| Nightlife | bar, nightclub, casino |
| Wellness | gym, spa, yoga, swimming_pool |
| Social Sports | bowling_alley, golf_course, tennis_court, climbing |

## Non-Goals (Post-MVP)
- User accounts or saved preferences
- Real ratings from Yelp or Google
- Time-based events
