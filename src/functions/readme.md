# TwoFold.js (2✂︎f) tags

The TwoFold tags are just regular Javascript functions, there's nothing special about them.
They can receive as input the text inside the tags (in case of double tags), extra props of the tag and user settings (in case they are defined).

There are two types of tags, and multiple options that make them behave differently.


## Single tags

Example: `<randomFloat decimals=2 />`.

Single tags are consumed after they are rendered, so they are one use only.
Some functions make more sense as single tags (eg: emojiClock).
They are useful in case of composing a document, when you want TwoFold to quickly autocomplete some text for you, and then stay out of your way.


### Double tags

Example:

```md
&gt;sortLines caseSensitive=true>

</sortLines>
```

Double tags are persistent and are normally rendered every time the file is processed by TwoFold.
Some functions make more sense as double tags, because they contain the text that needs to be processed.
They are useful in case of documentation, for example, to keep the document in sync with other external sources.


## Tag options

#### once

Example: `&gt;randomCard once=true></randomCard>`.

"Once" is a built-in option that tells TwoFold to not replace the text of the double tag, if there's already text inside it.
It works only with double tags.
To make TwoFold render the text again, you just need to delete the text inside the double tag.

#### consume

Example: `&gt;sortLines consume=true>some text here</sortLines>`.

"Consume" is a built-in option that tells TwoFold to consume a double tag after it's rendered, basically to convert it into a single tag.
It works only with double tags.
