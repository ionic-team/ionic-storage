var fs = require('fs');
module.exports = function removePrivateMembers() {
  return {
    name: 'remove-private-members',
    description: 'Remove member docs with @private tags or marked private',
    $runAfter: ['tags-parsed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if (doc.members) {
          doc.members = doc.members.filter(function(member) {
            return !member.tags.tagsByName.get('private') &&
                   !isFileIfPrivate(member.fileInfo.filePath,
                                   member.location.end.line);
          });
        }

        if (doc.statics) {
          doc.statics = doc.statics.filter(function(staticMethod) {
            return !staticMethod.tags.tagsByName.get('private') &&
                   !isFileIfPrivate(staticMethod.fileInfo.filePath,
                                   staticMethod.location.start.line);
          });
        }
      });

      return docs;
    }
  };
};

function isFileIfPrivate(filename, lineNo, log) {
  var data = fs.readFileSync(filename, 'utf8');
  var lines = data.split('\n');

  if (+lineNo > lines.length) {
    throw new Error('File end reached without finding line');
  }

  return lines[+lineNo].indexOf('private ') != -1;
}
