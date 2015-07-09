angular.module('chai.markdown', ['ngSanitize'])

/**
 * @name MarkdownTransform
 * @ngdoc provider
 * @description
 * Configurable provider for creating a middleware based transform
 * mechanism for markdown, post rendering.
 *
 * At configure time, the provider exposes a `.use` method that
 * takes a transform function. E.g.
 *
 * ```
 * MarkdownTransformProvider
 *   .pre(function(markdown) {
 *     // do some stuff, return something
 *     return markdown;
 *   })
 *   .post(function(element) {
 *     // do some stuff, return something else
 *     return element.find('a');
 *   })
 *   .post(function(anchors) {
 *     angular.forEach(anchors, function(a) {
 *       a.setAttribute('target', '_blank');
 *     });
 *   });
 * ```
 */
.provider('MarkdownTransform', function() {
  this.transforms = {
    pre: [],
    post: []
  };

  this.pre = function(transform) {
    this.transforms.pre.push(transform);
    return this;
  };

  this.post = function(transform) {
    this.transforms.post.push(transform);
    return this;
  };

  function createReducer(collection) {
    return function(initial) {
      return collection.reduce(function(context, transform) {
        return transform(context);
      }, initial);
    };
  }

  this.$get = function() {
    return {
      pre: createReducer(this.transforms.pre),
      post: createReducer(this.transforms.post)
    };
  };
})

/**
 * @name chaiMarkdown
 * @ngdoc directive
 * @description
 * Attribute based directive which will evaluate the attribute as
 * an expression, the convert the resulting markdown to HTML and
 * insert it into to element.
 */
.directive('chaiMarkdown', ['$sanitize', 'MarkdownTransform',
           function($sanitize, MarkdownTransform) {
  var converter = new showdown.Converter();

  return {
    restrict: 'A',
    scope: {
      chaiMarkdown: '='
    },
    link: function(scope, element) {
      scope.$watch('chaiMarkdown', function(markdown) {
        if(!markdown) return;

        // this is what happens when js provides no
        // composition operators :(

        // pre render transforms
        [MarkdownTransform.pre(markdown)]
          .map(converter.makeHtml)
          .map($sanitize)
          .map(element.html.bind(element));
        // post render transforms
        MarkdownTransform.post(element);
      });
    }
  };
}]);

