// Package modules.
import { Optimizer } from '@parcel/plugin';
import posthtml from 'posthtml';
import urls from 'posthtml-urls';

// Configure.
const stripIndexHtml = (url) => {
  // Verify the URL is our own.
  if (url.startsWith('/') && url.endsWith('.html')) {
    return url.replace(/^(.+)\/index\.html|index.html|\.html$/g, '$1');
  }

  return url; // Return original URL.
};

// Exports.
export default new Optimizer({
  // prettier-ignore
  async optimize({
    bundle,
    contents,
    map,
    options,
  }) {
    // Disable in hot mode because wrong index.html might be served.
    // @see https://github.com/parcel-bundler/parcel/issues/4740
    if (options.hot) {
      return { contents, map };
    }

    const { publicUrl } = bundle.target;
    const plugin = urls({ eachURL: stripIndexHtml.bind(publicUrl) });
    return {
      contents: (await posthtml([plugin]).process(contents)).html,
    };
  },
});
