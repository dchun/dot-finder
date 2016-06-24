Node implementation of opencv for contour detection.

Testing javascript wrapper for opencv.

Upload an image and count the dots in a petri dish.

Push to heroku like so:
```
heroku create myapp --buildpack https://github.com/automata/heroku-buildpack-opencv.git

heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
```

This is to ensure that opencv is available to your app