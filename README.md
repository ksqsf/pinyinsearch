# Pinyin Search
Pinyin Search is a GNOME Shell extension that introduces direct pinyin support
to app search. It also introduces some other enhancements to app search, and
you're likely to like it.

This version of Pinyin Search is compatible with GNOME 3.24.2. I encourage you
to test it against different versions of GNOME Shell and report whether it 
works.

Pinyin Search is still **under development** and pinyin match is **not implemented**.

![Screenshot](Screenshot.png)

## Features
* Pinyin Match: `软件` -> `ruanjian`, `ruan jian`, `ru ji`, `rj`, etc.
* First-char Match: `Avahi Zeroconf` -> `a z`.
* Whitespace Ignorance: `Avahi Zeroconf` -> `a z`.
* In-word Match: `Emacs` -> `acs`.

## Installation
This extension is not yet published to 
[GNOME Shell Extensions hub](https://extensions.gnome.org/),
but you can manually set it up for your beloved GNOME desktop.

```bash
git clone https://github.com/ksqsf/pinyinsearch ~/.local/share/gnome-shell/extensions/pinyinsearch@ksqsf.moe
```
Enable it with GNOME Tweak Tool or through GNOME Extensions.

## Customization

## License
MIT-style.

## Author
This extension is made with love by [ksqsf](https://ksqsf.moe).

`dict-zi-*.js` was authored by [hotoo](https://hotoo.me/), with modifications
by ksqsf.
