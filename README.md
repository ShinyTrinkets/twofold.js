# TwoFold.js (2✂︎f)

[![Project name][project-img]][project-url]
[![NPM version][npm-img]][npm-url]
[![Build status][build-img]][build-url]
[![Coverage][coverage-img]][coverage-url]
[![Prettier Style][style-img]][style-url]

> Glorified curly bubbly templates,<br />
> Templates with a twist,<br />
> Duplex templates,<br />
> Mirroring blueprints,<br />
> Context aware frames,<br />
> Self-replicating, self-terminating forms.

## ❓ What is this

TwoFold is a small Node.js library and command line app that allows plain text files to behave like dynamic files.
**Use-cases** include: auto updating documentation, text based dashboards, text virtual assistants, text spreadsheets, turn based games, etc.

This can done by writing XML-like `<whatever />` tags in your text files and calling TwoFold CLI to convert all known tags into useful responses. TwoFold can watch your files for changes and colaborate with you in the same file and the same place in the file, for example to validate some information, or calculate some min/ max or statistics, similar to a Spreadsheet application, or check for spelling, or grammar errors, similar to a Document editor, etc.

TwoFold CLI can be run manually to render a file or folder, or from a CRON job every X interval, or as a Git hook maybe to auto-update some documents, or can be run as a service to watch a list of folders and render the files matching some patterns everytime they change.

It **will work** with any file like: "*.txt", Markdown, reStructuredText, HTML, other templating libraries like Django, Liquid, Mustache, etc.<br/>
It could also work with Python/ Javascript/ Go-lang/ whatever programming language you use; probably it makes sense to write the tags as comments inside the code.<br/>
It **WON'T work** with binary files like: .doc, .pages, .xls, .numbers, .pdf, images, audio, or video. Running TwoFold on binary files MIGHT break them (with the default config), because media files contain XML-like tags [Exif](https://en.wikipedia.org/wiki/Exif) or [IPTC](https://en.wikipedia.org/wiki/IPTC_Information_Interchange_Model).

If you're editing your file with [Visual Studio Code](https://github.com/microsoft/vscode), [Atom editor](https://github.com/atom/atom), [Sublime text](https://sublimetext.com), [Micro terminal text editor](https://github.com/zyedidia/micro) (and others), you'll see the changes instantly, because they automatically refresh the text when the file changes.

The XML-like `<whatever />` tags are customizable and ideally should be invisible in the type of text file you're using (eg: XML-like tags are invisible when viewing the Markdown format).

The *single tags* are one use only, the are consumed after they render the response.
The *double tags* are refreshed every time the file is rendered.<br/>
They have different use-cases, different pros and cons. Read more in the [Tags Documentation](/docs/doc-tags.md).<br/>
Example: `<random_int />` might be converted into `3` and the tag disappears, but `<random_int></random_int>` might generate `<random_int>3</random_int>` the first time, and a new random number EVERY time the file is rendered by TwoFold.

Note that currently not all the tags mentioned as examples are implemented!<br/>
This repository provides the core framework and just a few tags. There are extra tags available in the [twofold-extras](https://github.com/ShinyTrinkets/twofold-extras) repository. You can of course, write your own tags, and load them with a cmd line switch.


## Notable features

* really extensible
* well tested
* fun fun fun


## 🔩 Instalation

Simply install with NPM:

> $ npm install twofold --global

The NPM package is called `twofold` and the CLI app is called `2fold`.


### 🔨 Usage

There are three types of commands available from the CLI:

* scan - scan one file, or a list of files using a pattern and list the known and unknown tags. The files are not modified.
* render - one time render of a file, or a list of files using a pattern
* watch - watch a file, or a list of files and render everytime the files change

The "--funcs" flag allows loading folders with any number
of Javascript files that expose extra functions, available as tags.

There's also "--tags" which lists all the available tags to be used,
including the ones loaded with the "--funcs" option.

Read more about the tags in the [Tags Documentation](/docs/doc-tags.md).


## 🚶‍♂️ Tutorial

Create a file called... `example.md` and write inside it:

```md
## Hello world!
It's a nice <emojiSunMoon /> outside and the time is <emojiClock /> .
Should I play with TwoFold some more ? <yesOrNo></yesOrNo> ugh...
```

Now, from command line, call TwoFold to scan the file, and see what tags are available:

> $ 2fold -s example.md

```
(2✂︎f) Scan: example.md
Text length :: 151
Number of tags :: 3
✓ { single: true, name: 'emojiSunMoon', tag: '&lt;emojiSunMoon />' }
✓ { single: true, name: 'emojiClock', tag: '&lt;emojiClock />' }
✓ { double: true, name: 'yesOrNo', tag: '&lt;yesOrNo></yesOrNo>' }
```

Call TwoFold again, to convert your file:

> $ 2fold example.md

Open the file and look at the changes :grin: You should see something like:

```md
## Hello world!
It's a nice 🌙 outside and the time is 🕥 .
Should I play with TwoFold some more ? <yesOrNo>Yes</yesOrNo> ugh...
```

To quickly test some built-in templates, or chain multiple CLI apps together, you can use pipes:

```sh
$ echo 'yes or no ? <yes_or_no />' | 2fold
$ echo 'random number: <random_int />' | 2fold
$ echo 'gimme a random game card ! <random_card />' | 2fold
$ echo 'sun / moon ? <emoji_sun_moon />' | 2fold
$ echo 'emoji time hehe <emoji_clock />' | 2fold
```

For the full list of available tags, check the [Tags Documentation](/docs/doc-tags.md).

For a list of IDEAS for tags, check [issue #1](https://github.com/ShinyTrinkets/twofold.js/issues/1).
Feel free to add your ideas and vote your favorite tags!!


## 📝 Notes

* it is tested on Linux and MacOS and "Should just work ™" on Windows, but it's not tested.
* it is a free & open-source software that comes **without warranty of any kind** that it works "as expected". The maintainers are trying really hard to write quality code and many tests, but there will be small 🐛 bugs, large 🐉 dragons and there are risks to lose your valuable data. **Always make copies and backups, to make sure your data is safe**.


### TwoFold vs other templates

There are a few differences between TwoFold and other templating libraries:

* TwoFold parser is designed to never crash. If it crashes, it's a bug and must be fixed.
  Tipically 99% of the text processed by TwoFold is just regular text and only a few XML-like tags would be processed.
  And it's expected that a large number of tags are badly formed, invalid XML.
* Usually templating libraries convert a data structure + a template file into another file.
  By default TwoFold uses the same file as both input, and output.
  And the tags are always functions, never data structures.


## ⌨️ Development

Check the [Changelog](/docs/Changelog.md) (the past) and the [Roadmap](/docs/Roadmap.md) (the future).


## Similar libraries

The original inspiration: https://nedbatchelder.com/code/cog
> Cog transforms files in a very simple way: it finds chunks of Python code embedded in them, executes the Python code, and inserts its output back into the original file. The file can contain whatever text you like around the Python code. It will usually be source code.

Very similar:
https://github.com/mosjs/mos
> A pluggable module that injects content into your markdown files via hidden JavaScript snippets

Also similar:
https://github.com/hairyhenderson/gomplate
> Flexible commandline tool for template rendering. Supports lots of local and remote datasources.

Kind of similar:
https://github.com/albinotonnina/mmarkdown
> Interpret mmd fenced code blocks in a Markdown file and generate a cooler version of it

Kind of similar:
https://github.com/verbose/verb
> Documentation generator for GitHub projects. Generate everything from API docs to readmes.

My awesome list of markdown-like goodies, I'm collecting them for months:<br/>
https://github.com/croqaz/awesome-markup

-----

## License

[MIT](LICENSE) © Shiny Trinkets.

[project-img]: https://badgen.net/badge/%E2%AD%90/Trinkets/4B0082
[project-url]: https://github.com/ShinyTrinkets
[npm-img]: https://badgen.net/npm/v/twofold?icon=npm&label
[npm-url]: https://npmjs.com/package/twofold
[build-img]: https://badgen.net/travis/ShinyTrinkets/twofold.js
[build-url]: https://travis-ci.org/ShinyTrinkets/twofold.js
[coverage-img]: https://codecov.io/gh/ShinyTrinkets/twofold.js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/ShinyTrinkets/twofold.js
[style-img]: https://badgen.net/badge/Code%20style/prettier/f2a
[style-url]: https://prettier.io
