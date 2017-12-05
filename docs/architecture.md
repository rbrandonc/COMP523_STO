# Project architecture

* Docs
  - Contains all relevant documentation for the project, as well as the markdown files for generating these pages.
* Server
  * Backend
    - Contains a js file for each screen. Each file contains the functions the server will send to the frontend to be run.
  * Frontend
    * Touchscreen
      - Contains the html, css, js, and resources to start the touchscreen.
    * Mainscreen
      - Contains the html, css, js, and resources to start the Mainscreen.
    * Projector
      - Contains the html, css, js, and resources to start the Projector.
  * Compiled
    - When the typescript is compiled to js, it is placed here and all resources are copied over to this folder.
  * bin
    - When the game is built for production, the binaries are placed here
  * res
    - Resources for all screens
