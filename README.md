Prototype museum exhibition webpage

To run locally:

You must first get an api key from the smithsonian

go here to sign up for one: https://api.data.gov/signup/

git clone https://github.com/uzougochukwu/exhibition-curator

cd exhibition-curator

cd src

create a folder caller 'extra'

create a file called API-KEY.js and put it in extra

in API-KEY.js type the following:

const smithsonian_api_key = "YOUR-API-KEY"

export default smithsonian_api_key

then save that file and go back to the terminal window

npm run dev

open a new terminal window

npm i

npm install cors-anywhere

cd node_modules

node cors-anywhere/server.js
