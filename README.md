Prototype museum exhibition webpage

Public url: https://my-exhibition.netlify.app/

To run locally:

You must first get an api key from harvard

go here to sign up for one: https://harvardartmuseums.org/collections/api

git clone https://github.com/uzougochukwu/exhibition-curator

cd exhibition-curator

cd src

create a folder caller 'extra'

create a file called API-KEY.js and put it in extra

in API-KEY.js type the following:

const harvard_api_key = "YOUR-API-KEY"

export default harvard_api_key

then save that file and go back to the terminal window

npm run dev

open a new terminal window

npm i

npm install cors-anywhere

cd ..
cd exhibition-creator/node_modules

node cors-anywhere/server.js

go back to the terminal window where you ran npm run dev

hold down the Ctrl key and click the localhost link in the terminal
