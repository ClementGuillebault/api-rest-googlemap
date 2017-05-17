# tripApi

tripApi is a API REST with Node, Express & Angularjs.

# Features

  - Load Json file from Object
  - Renderer direction from transport list with google service DirectionsRenderer
  - Set direction panel with DirectionsRenderer
  - Transform coord on formated adress with google service GéoCoding
  - Add, delete and see transports on map

### Tech

tripApi uses a number of open source projects to work properly:

* [AngularJS] - 1.6.4
* [Node.js] - 6.9.1
* [Express] - 4.15.2
* [Kube] - 6.5.2
* [Font-Awesome] - 4.7.0
* [jQuery] - 2.1.4
* And some others dépendances in package.json

### Installation & Run

tripApi requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.
```
$ npm install
...
$ npm start
```



### Test

Node & Express:
For running test, run the server and just use in dir of project

```
$ mocha tests
```

Angular:
For running test, use karma with this configuration
```
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/chai/chai.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-messages/1.6.4/angular-messages.min.js',
      'https://maps.googleapis.com/maps/api/js',
      'tests/angular/mock/mock-google-map.js',
      'app/*.js',
      'app/*/*.js',
      'tests/angular/*.js'
    ],
```

for run:
```
$ karma start
```

### Questions

-What you like, what you dislike about this test and computer sciences
  - like : Nodejs, angular and all computer things!
  - dislike : css and design

-Tell us how long did it take to code this
  - 20-30h

-What salary would you like for a position in Caen, Normandy
  - depends work