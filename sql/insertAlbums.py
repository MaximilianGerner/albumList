import csv
import mariadb

# Cover art: 33
# Album title: 32
# Artist name: 31
# Release date: 30
# Id: 29
# Owner id: 28
# Controversy: 26
# Genres: 24
# Fair Average: 22
# Average: 20
# Jonton: 18
# Clara: 16
# Markus: 14
# Mairinger: 12
# Thomas: 10
# Philipp: 8
# Max: 6
# Jahja: 4


# Module Imports
import mariadb
import sys

# Connect to MariaDB Platform
try:
    conn = mariadb.connect(
        user="root",
        password="4567",
        host="127.0.0.1",
        port=3306,
        database="AlbumList"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

# Get Cursor
cur = conn.cursor()

amOfAlbums = 2065;

with open('/home/max/projects/albumList/sql/data.tsv', mode='r') as file:
    csvFile = csv.reader(file, delimiter="\t")

    cur.execute("DELETE FROM recommend")
    cur.execute("ALTER TABLE recommend AUTO_INCREMENT = 0")
    cur.execute("DELETE FROM remember")
    cur.execute("ALTER TABLE remember AUTO_INCREMENT = 0")
    cur.execute("DELETE FROM rating")
    cur.execute("ALTER TABLE rating AUTO_INCREMENT = 0")
    cur.execute("DELETE FROM albumToArtist")
    cur.execute("ALTER TABLE albumToArtist AUTO_INCREMENT = 0")
    cur.execute("DELETE FROM artist")
    cur.execute("ALTER TABLE artist AUTO_INCREMENT = 0")
    cur.execute("DELETE FROM album")
    cur.execute("ALTER TABLE album AUTO_INCREMENT = 0")


    for i, line in enumerate(csvFile):
        if i != 0:
            if i >= amOfAlbums:
                break

            if line[22] == "-":
                line[22] = None

            if line[26] == "-":
                line[26] = None

            print(
                "INSERT INTO album (id,albumName,releaseDate, genres, averageRating, coverLink, userAdded, "
                "controversy) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (line[29], line[32], line[30], line[24], line[22], line[33], line[28], line[26]))

            cur.execute(
                "INSERT INTO album (id,albumName,releaseDate, genres, averageRating, coverLink, userAdded, "
                "controversy) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (line[29], line[32], line[30], line[24], line[22], line[33], line[28], line[26]))

            conn.commit()

with open('data.tsv', mode='r') as file:
    csvFile = csv.reader(file, delimiter="\t")
    cur = conn.cursor()

    for i, line in enumerate(csvFile):

        if i != 0:

            if i >= amOfAlbums:
                break

            for j in range(8):

                if line[4 + (j * 2)] == "-" or line[4 + (j * 2)] == "":
                    continue

                elif line[4 + (j * 2)] == "!!!":
                    print("INSERT INTO recommend (recommenderId, recommendeeId, albumId)"
                          "VALUES (%s, %s, %s)", (1, j + 1, line[29]))

                    cur.execute("INSERT INTO recommend (recommenderId, recommendeeId, albumId)"
                                "VALUES (%s, %s, %s)", (1, j + 1, line[29]))

                elif line[4 + (j * 2)] == "!" or line[4 + (j * 2)] == "?":
                    print("INSERT INTO remember (userId, albumId)"
                          "VALUES (%s, %s)", (j + 1, line[29]))

                    cur.execute("INSERT INTO remember (userId, albumId)"
                                "VALUES (%s, %s)", (j + 1, line[29]))

                else:
                    print("INSERT INTO rating (userId, albumId, score, dateOfRating)"
                          "VALUES (%s, %s, %s, %s)", (j + 1, line[29], line[4 + (j * 2)], "2024-02-14"))

                    cur.execute("INSERT INTO rating (userId, albumId, score, dateOfRating)"
                                "VALUES (%s, %s, %s, %s)", (j + 1, line[29], line[4 + (j * 2)], "2024-02-14"))

                conn.commit()

cur = conn.cursor()

with open('data.tsv', mode='r') as file:
    csvFile = csv.reader(file, delimiter="\t")

    for i, line in enumerate(csvFile):
        if i == 0: 
            continue

        elif i >= amOfAlbums:
            break

        artists = line[31].split("\\")

        for a in artists:

            response = None

            cur.execute("SELECT id FROM artist WHERE artistName = %s", (a,))
            print("SELECT id FROM artist WHERE artistName = %s", (a,))

            response = cur.fetchall()

            if len(response) == 0:
                print("INSERT INTO artist (artistName) VALUES (%s)", (a,))
                cur.execute("INSERT INTO artist (artistName) VALUES (%s)", (a,))
                conn.commit()
                cur.execute("SELECT LAST_INSERT_ID()")
                artistId = cur.fetchall()[0][0]

            else:
                print(response)
                artistId = response[0][0]

            print("INSERT INTO albumToArtist (artistId, albumId) VALUES (%s, %s)", (artistId, line[29]))
            cur.execute("INSERT INTO albumToArtist (artistId, albumId) VALUES (%s, %s)", (artistId, line[29]))


            conn.commit()
conn.close()

# INSERT INTO album (id,albumName,releaseDate, genres, averageRating, coverLink, userAdded, controversy) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ('1548', 'Presenting Billy Murray', '1903-05-27', 'vaudeville, vintage jazz', None, 'https://i.scdn.co/image/ab67616d00001e02a37fdf54f624fd339028bede', '1', None)
