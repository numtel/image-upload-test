Package.describe({
  name: 'numtel:cfs-image-resize',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  'data-uri-to-buffer': '0.0.4'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('underscore', 'server');
  api.use('numtel:phantomjs-persistent-server@0.0.11');
  api.addFiles('client.js', 'client');
  api.addFiles('server.js', 'server');
  api.export('resizeImageStream');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('numtel:cfs-image-resize');
  api.addFiles('test/index.js');
});
