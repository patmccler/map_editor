# Map Editor

This project is a basic 2d tile based map editor. It's inspired by the maps you see for Dungeons and Dragons, or games like the 2-D Legend Of Zelda titles that feature a top down perspective.

### The back end
The back end is a ruby on rails application that serves as an API. It stores the Levels and the tiles in those levels. It has some simple validations but doesn't handle much else.

### The front end
The front end is a single page application that uses the backend to fetch and store data. All of the rendering logic is in the front end.

## Setup
#### Steps:
1. Clone this repo
1. run `bundle exec db:migrate` in the backend folder
1. run `rails s` to start the rails server while in the backend directory
1. run `static-server` or another http server from the front end directory
    - this is required in order for the "module" js syntax to work locally
1. navigate to localhost:<the port your http server is running on> in a browser. static-server seems to default to 9080 but it should tell you in the console when you start the server