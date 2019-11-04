# TwoFold.js (2✂︎f) tags

The TwoFold tags are just regular Javascript functions, there's nothing special about them.<br/>
They can receive as input the text inside the tags (in case of double tags), extra props of the tag and user settings (in case they are defined).

All tags can be specified as camelCase (eg: emojiClock), or separated by underline (eg: emoji_clock).

There are two types of tags, and multiple options that make them behave differently.

**Note**: All examples here use double slash instead of single slash, to disable the tags, so that TwoFold doesn't accidentally render them. If you want to copy paste the examples, just remove the extra slash.


## Single tags

Example: `<randomFloat decimals=2 //>`

Single tags are consumed after they are rendered, so they are one use only.<br/>
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

Double tags are persistent and are normally rendered every time the file is processed by TwoFold.<br/>
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

Example: `<increment text=9 //>`

"Text" is a built-in option that allows single tags to receive text, just like double tags.<br/>
They will still be consumed after the first use. This option works only with single tags.
