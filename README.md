# chai-markdown

Configurable provider for creating a middleware based transform
mechanism for markdown, post rendering.

Works ontop of the [showdown](https://github.com/showdownjs/showdown) converter and binds markdown into an element through an attribute, similar to [btf-markdown](https://github.com/btford/angular-markdown-directive).

At configure time, the provider exposes `.pre` and `.post` methods that
take transform functions as arguments.

```js
MarkdownTransformProvider
  .pre(function(markdown) {
    // do some stuff before the markdown is rendered.
    // e.g. convert strong to emphasis
    return markdown.replace('__', '_');
  });

MarkdownTransformProvider
  .post(function(element) {
    // do some stuff after the markdown is rendered
    // e.g. give ems a class
    var ems = element.find('em');

    angular.forEach(ems, function(em) {
      em.setAttribute(em, 'my-em-class');
    });

    return element;
  });
```

Whichever value is returned will be passed into the next step of whichever rendering path you are on (pre/post).


Then render the markdown with the directive.

```
<div chai-markdown='"__hello__"'></div>
```

Which will render

```
<em class='my-em-class'>hello</em>
```

