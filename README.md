# albumList

## Features (sorted from high to low priority)

- Search for album in extern database and add it to album list
- Sort all albums by their average rating
- User system
- Sort albums by user ratings
- Stats like in the excel
- Recommendations (from user to user)
- Controversy
- Ratings log

## Server
REST-API using Node.js and express serving data as JSON.

## Extern Database API

Spotify used for most metadata requests. Last.Fm is only used when Spotify doesn't find anything; in this case, the release date must be input manually.

## Database structure

### Album
album|type
-|-
id (PK)|int
albumName|string
release date|date
genres|string
averageRating|float
coverLink|string
userAdded|int
controversy|int


### Artist
artist|type
-|-
id (PK)|int
artistName|string


### User
user|type
-|-
id (PK)|int
artistName|string


### Album to Artist
AlToAr|type
-|-
id (PK)|int
artistId (FK)|int
albumId (FK)|int


### Rating 
rating|type
-|-
id (PK)|int
userId (FK)|int
albumId (FK)|int
score|float
dateOfRating|date


### Remember
remember|type
-|-
id (PK)|int
userId (FK)|int
albumId (FK)|int


### Recommend
Recommendation|type
-|-
id (PK)|int
recommenderId (FK)|int
recommendeeId (FK)|int
albumId (FK)|int

