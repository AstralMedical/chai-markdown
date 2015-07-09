angular.module('chai.markdown', ['ngSanitize'])

/**
 * @name MarkdownTransform
 * @ngdoc provider
 * @description
 * Configurable provider for creating a middleware based transform
 * mechanism for markdown, before and after it is rendered..
 *
 * At configure time, the provider exposes `.pre` and `.post` methods that
 * take transform functions as arguments.
 *
 * ```
 * MarkdownTransformProvider
 *   .pre(function(markdown) {
 *     // do some stuff before the markdown is rendered.
 *     return markdown;
 *   });
 *
 * MarkdownTransformProvider
 *   .post(function(element) {
 *     // do some stuff after the markdown is rendered
 *     var anchors = element.find('a');
 *     angular.forEach(anchors, function(a) {
 *       a.setAttribute('target', '_blank');
 *     });
 *
 *     return element;
 *   });
 * ```
 *
 * Whichever value is returned will be passed into the next step of
 * whichever rendering path you are on (pre/post).
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

