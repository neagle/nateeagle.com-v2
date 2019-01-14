---
layout: post
title: 'Turn the Lights On At Sunset with your Raspberry Pi'
heroImage: 'flying-dutchman.jpg'
tags:
  - raspberrypi
  - nodejs
---

**Welcome to the Flying Dutchman!** My home bar (named after one of my favorite [Howard Pyle paintings](https://artsandculture.google.com/asset/the-flying-dutchman/cAGR51Ee00R71A)), has a lot of lights. I've had most of them hooked up to a [simple timer](https://www.amazon.com/Intermatic-TN311-Indoor-Decorations-Grounded/dp/B005MMSTNG/), which works pretty well for turning the lights on and off automatically at night, but it's not dynamic and the timer also makes an audible buzzing noise during normal operation. Not ideal.

What is ideal? Having a Raspberry Pi controlling all the lights. Now: in my _ideal_ world, I'd like to be able to control each one of the lights independently, and also use PWM to be able to dim the lights that support it. But I'm making that a goal for farther down the road.

I bought a [controllable four outlet power relay](https://www.adafruit.com/product/2935) that looked like a user-friendly first step into being able to control my lights. And it's great: it's very simple, as all you do is plug in two wires to it: ground (which you connect to a grounding pin on your micro-controller) and a control wire connected to a GPIO pin.

I connected mine to pin #adsfasd. At that point, all you do is turn the pin on or off, which means your actual code is no more complicated than the tutorial for blinking an LED on and off.

<video controls src="/files/fd-remote-on-off.mov" class="l-large"></video>

That gives you a nice, remote-controllable power strip in about five minutes. But now that you've got an actual computer attached, you can add a nice touch of elegance: dynamically set the time the lights turn on to the official minute of sunset at your longitude and latitude.

There's a simple npm module called [sun-time](https://www.npmjs.com/package/sun-time) that will give you the sunrise and sunset times for a given latitude on a given date. Using that, we can add some extra code to our `on` script to have it check tomorrow's sunset time, then write a file to the pi's `/etc/cron.d/` folder that tells it to run the `on` script again at sunset tomorrow.

I grabbed [my latitude and longitude](https://www.latlong.net/), then added this to my `on` script:
