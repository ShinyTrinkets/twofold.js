# TwoFold.js (2✂︎f) tags

The TwoFold tags are just regular Javascript functions, there's nothing special about them.<br/>
They can receive as input the text inside the tags (in case of double tags), extra props of the tag and user settings (in case they are defined).

For example, the `increment()` function looks like this:

```js
// math.js file
function increment({ text }, { nr = 1 } = {}) {
    return parseNumber(text) + parseNumber(nr)
}
```

And it can be called like: "&lt;increment nr=4>6&lt;/increment>".
The function will receive the args as: text="6" and nr="4".

All tags can be called in camelCase (eg: emojiClock), or separated by underline (eg: emoji_clock).

There are **two types of tags**, and multiple options that make them behave differently.

**Note**: All examples here use double slash instead of single slash, to disable the tags, so that TwoFold doesn't accidentally render them. If you want to copy paste the examples, just remove the extra slash.<br/>
We are collecting ideas about how to selectively disable tags from a text file in [issue #2](https://github.com/ShinyTrinkets/twofold.js/issues/2). Feel free to add your ideas!!


## Single tags

Example: `<randomFloat decimals=2 //>`

Single tags are **consumed** after they are rendered, so they are one use only.<br/>
Some functions make more sense as single tags (eg: emojiClock).<br/>
They are useful in case of composing a document, when you want TwoFold to quickly autocomplete some text for you, and then stay out of your way.


## Double tags

Example:

```md
<sortLines caseSensitive=true>
* a
* b
* c
<//sortLines>
```

Double tags are **persistent** and are normally rendered every time the file is processed by TwoFold.<br/>
Some functions make more sense as double tags, because they contain the text that needs to be processed.<br/>
They are useful in case of documentation, for example, to keep the document in sync with other external sources.


## Tag options

#### once

Example: `<randomCard once=true><//randomCard>`

"Once" is a built-in option that tells TwoFold to NOT replace the text inside the double tag, if there's already text inside it.
It works only with double tags.<br/>
To make TwoFold render the text again, you just need to delete the text inside the double tag.<br/>
This is useful in case you want to keep the previous text and make sure that TwoFold won't accidentally replace it.

#### consume

Example: `<sortLines consume=true>some text here<//sortLines>`

"Consume" is a built-in option that tells TwoFold to consume a double tag after it's rendered, basically to convert it into a single tag.<br/>
It works only with double tags.

#### text

Example: `<multiply text=9 nr=5 //>`

"Text" is a built-in option that allows single tags to receive text, just like double tags.<br/>
They will still be consumed after the first use. This option works only with single tags.


## Built-in tags

TODO: Replace this manual list with the auto-generated list, when it's ready

Note: The built-in tags are simple and ZERO dependencies, just enough to have some tags available to start with.
There are extra tags available in the [twofold-extras](https://github.com/ShinyTrinkets/twofold-extras) repository.
You can of course, write your own tags, and load them with the `--funcs` cmd line switch.

#### multiply nr=1

#### increment nr=1

#### randomInt min=1 max=100

#### randomFloat min=1 max=100 decimals=2

#### yesOrNo emoji=true

#### leftOrRight emoji=true

#### upOrDown

#### randomSlice

#### randomDice

#### randomCard nr=1

#### sortLines caseSensitive=false

#### dayOrNight date=now

#### emojiSunMoon date=now

#### emojiDayNight date=now

#### emojiClock date=now showHalf=true
