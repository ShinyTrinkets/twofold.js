# TwoFold.js (2✂︎f)

[![Project name][project-img]][project-url]
[![Build status][build-img]][build-url]
[![Coverage][coverage-img]][coverage-url]
[![Prettier Style][style-img]][style-url]

> Glorified curly bubbly templates,<br />
> Templates with a twist,<br />
> Duplex templates,<br />
> Mirroring blueprints,<br />
> Context aware frames,<br />
> Self-replicating, self-terminating forms.

## What is this

TwoFold is a small application that takes as input a text file containing one, or more "template tags" in the form of: `<replace-me-with-something-useful />`, it processes the tags and overwrites the file with the result.

This idea is not new at all, it's been used since forever, but there are a few essential differences in TwoFold:

If you have a file containing: `Hello <replace-whatever>world</replace-whatever>!`, then:

1. the file containing this template is both input and output (it's over-written on every render)
1. "whatever" can only be a function, never a fixed value
1. "world" is passed as input to the "whatever" function, thus affecting the next result and allowing a possible chain effect in the succeeding renders
1. all of the text is also passed as input to the "whatever" function, for context, thus allowing the function to behave differently depending on the text close to it
1. if the `<whatever />` tag is single, it is volatile (will be destroyed after the first render)
1. there are different types of tags like: replace, insert, or append, to allow different behaviour inside the tags

The React-like `<whatever />` tags are totally customizable and ideally should be invisible in the type of text file you're using (eg: React-like tags are invisible when viewing the Markdown format).

### Why is this useful

All the templates today work by reading one or more input files containing the template and write one output file containing the result. This is useful in a lot of the situations, but there are cases where it would be more useful to see both the input and output in the same file, to create auto-updating notes, or the much-sought-after auto-updating documentation.

This repository provides the core framework and some of the tools for doing that.

### Notable features

* really small
* well tested
* fun fun fun

### Install and use

Simply install with npm:

> $ npm install twofold --global

The NPM package is called `twofold` and the CLI app is called `2fold`.

Create a file called for example `something.md` and write inside it:

```md
## Hello world!
It's a nice <emojiSunMoon /> outside and the time is <emojiClock /> .
Should I play with TwoFold some more ? <yesOrNo></yesOrNo> ugh...
```

Now, from command line, call TwoFold to convert your file:

> $ 2fold something.md

Open the file again and look at the changes :grin: You should see something like:

```md
## Hello world!
It's a nice 🌙 outside and the time is 🕥 .
Should I play with TwoFold some more ? <yesOrNo>Yes</yesOrNo> ugh...
```

If you're editing your file with Visual Studio Code, Atom editor, or Sublime text, you'll see the changes instantly, because they automatically refresh the editor when the file changes.

To quickly test some built-in templates, without writing a text file:

> $ echo 'yes or no ? \<yes_or_no />' | 2fold<br />
> $ echo '< left < or > right > ? \<left_or_right />' | 2fold<br />
> $ echo 'random number: \<random_int />' | 2fold<br />
> $ echo 'gimme a random game card ! \<random_card />' | 2fold<br />
> $ echo 'sun / moon ? \<emoji_sun_moon />' | 2fold<br />
> $ echo 'emoji time hehe \<emoji_clock />' | 2fold

All tags can be specified as camelCase (eg: emojiClock), or separated by underline (eg: emoji_clock).

### Notes

* TwoFold is designed for Node.js. It will work on browsers with small changes, but I think it wouldn't make much sense if you're not working with files.
* As for the Operating System, this is tested on Linux and MacOS and "Should just work ™" on Windows, but I haven't tested it.
* TwoFold is a free & open-source software that comes **without warranty of any kind** that it works "as expected". The maintainers are trying really hard to write quality code and tests, but there will be bugs and there are risks to lose your valuable data. Always make copies and backups, to make sure your data is safe.

## Similar libraries

My original inspiration: https://nedbatchelder.com/code/cog
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

My awesome list of markdown-like goodies, I'm collecting them for months:
https://github.com/croqaz/awesome-markup

-----

## License

[MIT](LICENSE) © Shiny Trinkets.

[project-img]: https://badgen.net/badge/%E2%AD%90/Trinkets/4B0082
[project-url]: https://github.com/ShinyTrinkets
[build-img]: https://badgen.net/travis/ShinyTrinkets/twofold.js
[build-url]: https://travis-ci.org/ShinyTrinkets/twofold.js
[coverage-img]: https://codecov.io/gh/ShinyTrinkets/twofold.js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/ShinyTrinkets/twofold.js
[style-img]: https://badgen.net/badge/Code%20style/prettier/f2a
[style-url]: https://prettier.io
