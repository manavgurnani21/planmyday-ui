# List of APIs and the Schemas for transaction:

1. 'get-interests' -> this endpoint should return a list of interests that are currently being set by the front-end (UI interaction on the landing page)

*Input:* None

*Output:*
``` tsx
type InterestsReturnMessage = {
	interests: Interest[];
};
```

2. 'perform-search' -> this enpoint sends the following information:

*Input:*

``` tsx
type SearchQuery = {
	location: String;
	maxRadius: number;
	maxNumResults: number;
	userInterests: (Interest | String)[]
};
```

*Output:*
```tsx
type SearchResult = {
	activityName: String;
	distance: float;
	link?: url;
	directionsLink?: url;
	location: Location;
	locationType: LocationType;
	
}
```


