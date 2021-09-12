import * as React from 'react';

import {connect} from 'react-redux';
import {block as bem} from 'bem-cn';

import {State as StoreTree} from 'store/index';

import {Metadata} from 'models/metadata';

import './index.scss';

interface OwnProps {
  ssr?: boolean;
  metadata: Metadata;
}

interface Props extends OwnProps {

}

interface State {
}

const block = bem('app');

export class App extends React.Component<Props, State> {
  public componentDidMount() {
    const {
      title,
      description,
      keywords,
      author,
      images,
      videos,
      audios,
    } = this.props.metadata;

    // Remove old meta
    [
      'title',
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[name="author"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:image:type"]',
      'meta[property="og:image:width"]',
      'meta[property="og:image:height"]',
      'meta[property="og:image:alt"]',
      'meta[property="og:video"]',
      'meta[property="og:video:type"]',
      'meta[property="og:video:width"]',
      'meta[property="og:video:height"]',
      'meta[property="og:audios"]',
      'meta[property="og:audios:type"]',
    ].forEach((selector) => Array.from(document.head.querySelectorAll(selector)).forEach((node) => document.head.removeChild(node)));

    function addMeta(params: {name?: string, content?: string, property?: string, lastModified?: string}) {
      const meta = document.createElement('meta');
      if (params.name) {
        meta.name = params.name;
      }
      if (params.content) {
        meta.content = params.content;
      }
      if (params.property) {
        meta.setAttribute('property', params.property);
      }
      if (params.lastModified) {
        meta.setAttribute('last-modified', params.lastModified);
      }
      document.head.appendChild(meta);
    }

    if (title) {
      const titleElement = document.createElement('title');
      titleElement.innerText = title;
      document.head.appendChild(titleElement);
    }

    if (description) {
      addMeta({name: 'description', content: description});
    }

    if (keywords) {
      addMeta({name: 'keywords', content: keywords});
    }

    if (author) {
      addMeta({name: 'author', content: author.name});
    }

    if (title) {
      addMeta({property: 'og:title', content: title});
    }

    if (description) {
      addMeta({property: 'og:description', content: description});
    }

    if (images) {
      for (const {src, type, width, height, alt} of images) {
        addMeta({property: 'og:image', content: src});
        addMeta({property: 'og:image:type', content: type});
        addMeta({property: 'og:image:width', content: width});
        addMeta({property: 'og:image:height', content: height});
        addMeta({property: 'og:image:alt', content: alt});
      }
    }

    if (videos) {
      for (const {src, type, width, height} of videos) {
        addMeta({property: 'og:video', content: src});
        addMeta({property: 'og:video:type', content: type});
        addMeta({property: 'og:video:width', content: width});
        addMeta({property: 'og:video:height', content: height});
      }
    }

    if (audios) {
      for (const {src, type} of audios) {
        addMeta({property: 'og:audios', content: src});
        addMeta({property: 'og:audios:type', content: type});
      }
    }
  }

  public render() {
    return (
        <section className={block()}>
          {this.props.ssr ? <code data-extract={true} dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.metadata)}} /> : null}
          <h1>{this.props.metadata.h1}</h1>
        </section>
    );
  }
}

export default connect(
    (state: StoreTree, ownProps: OwnProps) => ({
      ...ownProps
    }),
    (dispatch) => ({}),
)(App);
