Welcome to PiP Player 1.0.2

> [!NOTE]
> A word of warning: this app is HEAVILY under development as you certainly might see bugs here and there. Don't be afraid to submit issues you found via [Issues](https://github.com/WickyPlays/pip-player/issues)

## What is this?

I'm glad you asked!
Hello, and welcome to my first Electron project. This project allows you to run any browser links especially videos like from Youtube to a custom PiP app for Windows (and Mac, Linux if I finish the setup). which helps you to watch stuffs with the link (eg: YouTube) while working on the same monitor at the same time. Convenient, right?

It helps solve the problem that most browsers' PiP nowadays are lacking: less controls (Chrome, Edge, etc.), no option for shortcuts, and more.

## How to use

1. Install and open the .exe file from the Github release page. No further installations required (at least for now).
2. Copy and paste the link (YouTube, etc.) from your browser into the address bar on the top of windows.
3. Press "Play" and enjoy your stuff!

## To-do list

* [X]  An AdBlocker.
* [ ]  [SponsorBlock](https://github.com/ajayyy/SponsorBlock)
* [ ]  Custom settings (default resolution, etc.)
* [ ]  More supports for other media platforms (Vimeo, Dailymotion, etc.).
* [ ]  Local video file support.
* [ ]  Mac & Linux support (since the build requires a Mac and Linux PC).
* [ ]  Browser extension support w/ protocol (pipplayer://)
* [ ]  Custom playback controls.

## Install & Build

Clone the repo and install dependencies:

```bash
git clone https://github.com/WickyPlays/pip-player.git
cd pip-player
yarn install
```

Note: You can use `npm` if you want to.

To start, simply use:

```
yarn start
```

Building app using the following command:

```
yarn run package
```

Enjoy your code!

## A notice to Electron

This is merely a temporary solution as part of my small project in my free time. However, it does not mean I have much knowledge on Electron.

In fact, a single Electron app can cost a lot of storage (MB) just for simple stuffs, which I thought would be more efficient via [Tauri](https://tauri.app/). The reason I won't use it (will consider in the future) is that this relies heavily on sub-webview, which is not customizable on Tauri for the time being.

## Contributing

Everyone is allowed to contribute to the code via pull request (PR).

## A Thank You To The Following

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)
