Node implementation of opencv for contour detection.

Testing javascript wrapper for opencv.

Upload an image and count the dots in a petri dish.

Push to heroku like so:
```
heroku create myapp --buildpack heroku/nodejs
heroku buildpacks:add --index 1 https://github.com/automata/heroku-buildpack-opencv.git
```

This is to ensure that opencv is available to your app