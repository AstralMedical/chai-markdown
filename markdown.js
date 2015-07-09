angular.module('chai.markdown', ['ngSanitize'])

.service('MarkdownTransform', function($sanitize) {
  this.linkTarget = function(destination, html) {
    return html.replace(/<a /, '<a target="' + destination + '" ');
  };

  this.sanitize = $sanitize;
})

.directive('chaiMarkdown', function(MarkdownTransform) {
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
          .map(MarkdownTransform.linkTarget.bind(null, '_blank'))
          .map(MarkdownTransform.sanitize)
          .map(element.html.bind(element));
      });
    }
  };
});

