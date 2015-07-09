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
 *   .use(function(element) {
 *     // do some stuff, return something
 *     return element;
 *   })
 *   .use(function(element) {
 *     // do some stuff, return something else
 *     return element.find('a');
 *   })
 *   .use(function(anchors) {
 *     angular.forEach(anchors, function(a) {
 *       a.setAttribute('target', '_blank');
 *     });
 *   });
 * ```
 */
.provider('MarkdownTransform', function() {
  this.transforms = [];

  this.use = function(transform) {
    this.transforms.push(transform);
    return this;
  };

  this.$get = function() {
    return function(element) {
      this.transforms.reduce(function(context, transform) {
        return transform(element);
      }, element);
    }.bind(this);
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

        // this is what happens when js provides no composition operators.
        // :(
        [markdown]
          .map(converter.makeHtml)
          .map($sanitize)
          .map(element.html.bind(element));

        // pass the element into the transform middleware
        MarkdownTransform(element);
      });
    }
  };
}]);

