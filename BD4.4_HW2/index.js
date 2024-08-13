//npm install express sqlite3 sqlite
//node BD4.4_HW2/initDB.js
//node BD4.4_HW2
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.4_HW2/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.4_HW2" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Fetch All Artworks

Create an endpoint /artworks to return all the artworks.

Create a function fetchAllArtworks to fetch all the artworks from the database and only returns the columns id, title & artist.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/artworks

Expected Response:

{
  'artworks': [
    {
      id: 1,
      title: 'Starry Night',
      artist: 'Vincent Van Gogh',
    },
    // Rest of the artwork entries in the database in the same format
  ]
}

*/
// function to fetch id, title & artist of all artworks from the database
async function fetchAllArtworks() {
  let query = "SELECT id, title, artist FROM artworks";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No artworks found");
    }
    return { artworks: result };
  } catch (error) {
    console.log("Error in fetching artworks ", error.message);
    throw error;
  }
}
// Endpoint to fetch id, title & artist of all artworks from the database
app.get("/artworks", async (req, res) => {
  try {
    let artworks = await fetchAllArtworks();
    console.log("Succesfully fetched all artworks");
    console.log("Number of artworks fetched are " + artworks.artworks.length);
    return res.status(200).json(artworks);
  } catch (error) {
    if (error.message === "No artworks found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 2: Fetch Artworks by Artist

Create an endpoint /artworks/artist/:artist to return artworks by the given artist.

Create a function fetchArtworksByArtist to fetch artworks by the artist from the database.

Extract only id, title, artist & year columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/artworks/artist/Vincent%20Van%20Gogh

Expected Response:

{
  artworks: [
    { id: 1, title: 'Starry Night', artist: 'Vincent Van Gogh', year: 1889 },
    { id: 3, title: 'Sunflowers', artist: 'Vincent Van Gogh', year: 1888 },
    { id: 4, title: 'The Night Café', artist: 'Vincent Van Gogh', year: 1889 },
    {
      id: 8,
      title: 'The Starry Night Over the Rhone',
      artist: 'Vincent Van Gogh',
      year: 1888,
    },
  ],
}*/
// function to fetch id, title, artist & year of artworks by the artist from the database
async function fetchArtworksByArtist(artist) {
  let query = "SELECT id, title, artist, year FROM artworks WHERE artist = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [artist]);
    if (!result || result.length == 0) {
      throw new Error("No artworks found for artist : " + artist);
    }
    return { artworks: result };
  } catch (error) {
    console.log(
      "Error in fetching artworks by artist : " + artist,
      error.message,
    );
    throw error;
  }
}
// Endpoint to fetch id, title, artist & year of artworks by the artist from the database
app.get("/artworks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let artworks = await fetchArtworksByArtist(artist);
    console.log("Succesfully fetched artworks by artist : " + artist);
    console.log("Number of artworks fetched are " + artworks.artworks.length);
    return res.status(200).json(artworks);
  } catch (error) {
    if (error.message === "No artworks found for artist : " + artist) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Fetch Artworks by Year

Create an endpoint /artworks/year/:year to return artworks by the given year.

Create a function fetchArtworksByYear to fetch artworks by the year from the database.

Extract only id, title, artist & year columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/artworks/year/1889

Expected Response:

{
  artworks: [
    { id: 1, title: 'Starry Night', artist: 'Vincent Van Gogh', year: 1889 },
    { id: 4, title: 'The Night Café', artist: 'Vincent Van Gogh', year: 1889 },
  ],
}*/
// function to fetch id, title, artist & year of artworks by the year from the database
async function fetchArtworksByYear(year) {
  let query = "SELECT id, title, artist, year FROM artworks WHERE year = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [year]);
    if (!result || result.length == 0) {
      throw new Error("No artworks found for year : " + year);
    }
    return { artworks: result };
  } catch (error) {
    console.log("Error in fetching artworks by year : " + year, error.message);
    throw error;
  }
}
// Endpoint to fetch id, title, artist & year of artworks by the year from the database
app.get("/artworks/year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let artworks = await fetchArtworksByYear(year);
    console.log("Succesfully fetched artworks by year : " + year);
    console.log("Number of artworks fetched are " + artworks.artworks.length);
    return res.status(200).json(artworks);
  } catch (error) {
    if (error.message === "No artworks found for year : " + year) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 4: Fetch Artworks by Medium

Create an endpoint /artworks/medium/:medium to return artworks by the given medium.

Create a function fetchArtworksByMedium to fetch artworks by the medium from the database.

Extract only id, title, artist & medium columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/artworks/medium/Oil%20Painting

Expected Response:

{
  artworks: [
    {
      id: 1,
      title: 'Starry Night',
      artist: 'Vincent Van Gogh',
      medium: 'Oil Painting',
    },
    {
      id: 2,
      title: 'Mona Lisa',
      artist: 'Leonardo Da Vinci',
      medium: 'Oil Painting',
    },
    {
      id: 3,
      title: 'Sunflowers',
      artist: 'Vincent Van Gogh',
      medium: 'Oil Painting',
    },
    {
      id: 4,
      title: 'The Night Café',
      artist: 'Vincent Van Gogh',
      medium: 'Oil Painting',
    },
    {
      id: 5,
      title: 'The Persistence of Memory',
      artist: 'Salvador Dali',
      medium: 'Oil Painting',
    },
    {
      id: 6,
      title: 'The Scream',
      artist: 'Edvard Munch',
      medium: 'Oil Painting',
    },
    {
      id: 7,
      title: 'Guernica',
      artist: 'Pablo Picasso',
      medium: 'Oil Painting',
    },
    {
      id: 8,
      title: 'The Starry Night Over the Rhone',
      artist: 'Vincent Van Gogh',
      medium: 'Oil Painting',
    },
    {
      id: 9,
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer',
      medium: 'Oil Painting',
    },
  ],
}
*/
// function to fetch id, title, artist & medium of artworks by the medium from the database
async function fetchArtworksByMedium(medium) {
  let query = "SELECT id, title, artist, medium FROM artworks WHERE medium = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [medium]);
    if (!result || result.length == 0) {
      throw new Error("No artworks found for medium : " + medium);
    }
    return { artworks: result };
  } catch (error) {
    console.log(
      "Error in fetching artworks by medium : " + medium,
      error.message,
    );
    throw error;
  }
}
// Endpoint to fetch id, title, artist & medium of artworks by the medium from the database
app.get("/artworks/medium/:medium", async (req, res) => {
  try {
    let medium = req.params.medium;
    let artworks = await fetchArtworksByMedium(medium);
    console.log("Succesfully fetched artworks by medium : " + medium);
    console.log("Number of artworks fetched are " + artworks.artworks.length);
    return res.status(200).json(artworks);
  } catch (error) {
    if (error.message === "No artworks found for medium : " + medium) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
