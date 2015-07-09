# chai-markdown

Configurable provider for creating a middleware based transform
mechanism for markdown, post rendering.

Works ontop of the [showdown](https://github.com/showdownjs/showdown) converter and binds markdown into an element through an attribute, similar to [btf-markdown](https://github.com/btford/angular-markdown-directive).

At configure time, the provider exposes a `.use` method that
takes a transform function. E.g.

```js
.config(function(MarkdownTransformProvider) {
  MarkdownTransformProvider
    .use(function(element) {
      // do some stuff, return something
      return element;
    })
    .use(function(element) {
      // do some stuff, return something else
      return element.find('a');
    })
    .use(function(anchors) {
      angular.forEach(anchors, function(a) {
        a.setAttribute('target', '_blank');
      });
    });
});
```

Then render the markdown with the directive.

```
<div chai-markdown='"[hello](world)"'></div>
```

Now all anchor tags should have `target="_blank"`.

