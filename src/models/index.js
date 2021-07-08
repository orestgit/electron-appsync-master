const ds = require('@aws-amplify/datastore')
const schema = require('./schema')
const PostStatus = {
  "DRAFT": "DRAFT",
  "PUBLISHED": "PUBLISHED"
};

const { Post } = ds.initSchema(schema.schema);

exports.Post = Post;
exports.PostStatus = PostStatus