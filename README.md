# Top Vinyl
An API serving up data on some of the top vinyl albums from 1958-1992

#### v1.0.0
[![Build Status](https://travis-ci.org/jarushford/top-vinyl.svg?branch=master)](https://travis-ci.org/jarushford/top-vinyl)

<br/>

### [SETUP INSTRUCTIONS](https://github.com/jarushford/top-vinyl/blob/master/setup.md)
### [CONTRIBUTING](https://github.com/jarushford/top-vinyl/blob/master/contributing.md)

<br/>

### [BASE URL](https://top-vinyl.herokuapp.com)

```
https://top-vinyl.herokuapp.com
```
<br/>
<br/>

[GET all albums](#get-all-albums)

[POST a new album](#post-a-new-album)

[GET a specific album](#get-a-specific-album)

[UPDATE a specific album](#update-a-specific-album)

[DELETE a specific album](#delete-a-specific-album)

[GET all tracks for a specific album](#get-all-tracks-for-a-specific-album)

[POST a new track to a specific album](#post-a-new-track-to-a-specific-album)

[GET all tracks](#get-all-tracks)

[GET a specific track](#get-a-specific-track)

[UPDATE a specific track](#update-a-specific-track)

[DELETE a specific track](#delete-a-specific-track)

<br/>

### GET all albums

```
GET /api/v1/albums (200)
```
This will return an array of every album in the database, in no particular order. The following query parameters may be added to this request in the following example format: `https://top-vinyl.herokuapp.com/api/v1/albums?year=1982`.

| Parameter       |  Description   |
| -------------   | :------------- |
| `rating`        | This parameter can be an integer or float between 0 and 5. It will filter results and only return results with a rating greater than the rating passed in. For example `rating=4.35` will return results with a rating greater than `4.35 / 5`.              |
| `year`          | This parameter must be a year in `YYYY` format. It will filter results and return only results with a year that matches the year passed in. For example `year=1973` will return only the results with a year of `1973`.               |
| `sortByYear`    | This parameter must be a boolean. `sortByYear=true` will return all results sorted from less recent to more recent. This can be used in conjunction with `rating` but not `sortByRating`.                |
| `sortByRating`  | This parameter must be a boolean. `sortByRating=true` will return all results sorted from highest rated to lowest rated. This can be used in conjunction with `rating` or `year` but not `sortByYear`.               |

<br/>

### POST a new album

```
POST /api/v1/albums (201)
```
This allows you to post a new album to the database, so long as it is formatted correctly. The correct format is shown below:

```
const newAlbum = {
  artist: "Led Zeppelin",
  genre: "Rock",
  year: "1973",
  rating: 4.68,
  album: "Houses of the Holy"
}
```
Note that rating is provided as an `<Int>` or `<Float>` and not a `<String>`. Also note that no ID is included; this will be provided upon addition to the database. All parameters shown are required.

<br/>

### GET a specific album

```
GET /api/v1/albums/:id (200)
```
This will return a single album that matches the ID provided in the request path, provided that an album with that ID exists in the database.

##### Sample Response

```
GET /api/v1/albums/1

{
  id: 1,
  artist: "Pink Floyd",
  genre: "Rock",
  year: "1973",
  created_at: "2019-01-30T18:10:07.120Z",
  updated_at: "2019-01-30T18:10:07.120Z",
  rating: "4.69 / 5",
  album: "The Dark Side Of The Moon"
}

```
<br/>

### UPDATE a specific album

```
PUT /api/v1/albums/:id (202)
```
This allows you to update information for a specific album. All information for that album must be provided, not just the property being updated, as shown in the sample below.

##### Sample

```
const updatedAlbum = {
  artist: "Led Zeppelin",
  genre: "Rock",
  year: "1971",     // Property being updated
  rating: 4.68,
  album: "Houses of the Holy"
}
```
<br/>

### DELETE a specific album

```
DELETE /api/v1/albums/:id (202)
```
This allows you to delete an album from the database, provided there is an album with the ID given. If the record is successfully deleted, you will recieve the following confirmation: `Successfully deleted album ':id'`

### GET all tracks for a specific album

```
GET /api/v1/albums/:id/tracks (200)
```
This will find the albums that matches the provided ID, if one exists, and return an array of all of the tracks on that album.

##### Sample Response 

```
GET /api/v1/albums/34/tracks

[
  {
    id: 422,
    name: "Holidays In The Sun",
    duration: "3:10",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.030Z",
    updated_at: "2019-01-30T18:10:08.030Z"
  },
  {
    id: 424,
    name: "No Feelings",
    duration: "2:48",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.037Z",
    updated_at: "2019-01-30T18:10:08.037Z"
  },
  {
    id: 432,
    name: "E.M.I.",
    duration: "3:06",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.075Z",
    updated_at: "2019-01-30T18:10:08.075Z"
  },
  {
    id: 430,
    name: "Pretty Vacant",
    duration: "3:14",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.072Z",
    updated_at: "2019-01-30T18:10:08.072Z"
  },
  {
    id: 423,
    name: "Liar",
    duration: "2:39",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.036Z",
    updated_at: "2019-01-30T18:10:08.036Z"
  },
  {
    id: 431,
    name: "New York",
    duration: "3:03",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.074Z",
    updated_at: "2019-01-30T18:10:08.074Z"
  },
  {
    id: 425,
    name: "God Save The Queen",
    duration: "3:17",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.038Z",
    updated_at: "2019-01-30T18:10:08.038Z"
  },
  {
    id: 429,
    name: "Bodies",
    duration: "3:00",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.060Z",
    updated_at: "2019-01-30T18:10:08.060Z"
  },
  {
    id: 428,
    name: "Anarchy In The UK",
    duration: "3:30",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.056Z",
    updated_at: "2019-01-30T18:10:08.056Z"
  },
  {
    id: 426,
    name: "Problems",
    duration: "4:10",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.055Z",
    updated_at: "2019-01-30T18:10:08.055Z"
  },
  {
    id: 427,
    name: "Seventeen",
    duration: "2:00",
    album_id: 34,
    created_at: "2019-01-30T18:10:08.056Z",
    updated_at: "2019-01-30T18:10:08.056Z"
  }
]
```

<br/>

### POST a new track to a specific album

``` 
POST /api/v1/album/:id/tracks (201)
```
This allows you to add a new track to a specific album, provided that all of the required information is present in the request body. Below is an example of how this should look:

```
const newTrack = {
  name: "The Optimist",
  duration: "5:30"
}
```
Note that duration is a `<String>` in MM:SS format. No album_id is required, it will be taken from the request parameters (path). Also, no ID is required, as this will be generated upon addition to the database. All properties shown are required.

<br/>

### GET all tracks

```
GET /api/v1/tracks (200)
```
This will return an array of every track in the database, in no particular order.

<br/>

### GET a specific track

```
GET /api/v1/tracks/:id (200)
```
This will return only the track with an ID that matches the ID provided, as long as it exists in the database.

##### Sample Response

```
GET /api/v1/tracks/345

{
  id: 345,
  name: "Time Is",
  duration: "9:42",
  album_id: 26,
  created_at: "2019-01-30T18:10:07.887Z",
  updated_at: "2019-01-30T18:10:07.887Z"
}
```

<br/>

### UPDATE a specific track

```
PUT /api/v1/tracks/:id (202)
```
This allows you to update information for an individual track. Name and duration must be provided in the request body, not only the property being updated. This format is shown below.

```
const updatedTrack = {
  name: "Time Is",
  duration: "8:45"     // Property being updated
}
```
Note: ID and album_id cannot be changed

<br/>

### DELETE a specific track

```
DELETE /api/v1/tracks/:id (202)
```
This allows you to delete a specific track, provided it exists in the database. If the record is successfully deleted, you will recieve the following confirmation: `Successfully deleted track ':id'`


