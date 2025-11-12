# Exhibition Curator

Create your own personal exhibition, using artworks from the Cleveland Museum of Art and the Harvard Art Museum.

Search for the artworks that match a particular interest (e.g. wildlife) and sort them alphabetically or by the year they were created.

Public url: https://my-exhibition.netlify.app/

## To run locally:

You must first get an api key from harvard

go here to sign up for one: https://harvardartmuseums.org/collections/api

Open up a terminal:

> git clone https://github.com/uzougochukwu/exhibition-curator
>
> cd exhibition-curator
> npm i
> npm install cors-anywhere
> 
> cd src

Make sure you are in the src directory.

Create a folder caller 'extra'.

In this folder create a file called API-KEY.js 

Type the following:

const harvard_api_key = "YOUR-API-KEY"

export default harvard_api_key

Replace YOUR-API-KEY with the actual Harvard API key.

The file should look something like this: 
![FilePic](./fileimage.png)

Save that file and go back to the terminal window.

> npm run dev

Open a separate terminal window

> cd ..
> cd exhibition-creator/node_modules
> node cors-anywhere/server.js

In your brower url box, type in "http://localhost:5173" and press enter.
