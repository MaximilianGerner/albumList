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


## Database structure

### Album
album|type
-|-
id (PK)|int
name|string
release date|date
genres|string


### Artist
artist|type
-|-
id (PK)|int
name|string


### User
user|type
-|-
id (PK)|int
name|string


### Album to Artist
AlToAr|type
-|-
id (PK)|int
artist id (FK)|int
album id (FK)|int


### Rating 
rating|type
-|-
id (PK)|int
user id (FK)|int
album id (FK)|int
