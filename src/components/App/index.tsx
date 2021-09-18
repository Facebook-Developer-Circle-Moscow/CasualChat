import * as React from 'react';

import {connect} from 'react-redux';
import {block as bem} from 'bem-cn';

import cn from 'classnames';

import {State as StoreTree} from 'store/index';

import {Metadata} from 'models/metadata';
import {User} from 'models/user';

import './index.scss';

interface OwnProps {
  ssr?: boolean;
  metadata: Metadata;
  children?: React.ReactNode;
  page?: string;
  className?: string;
}

interface Props extends OwnProps {
  csrf: string;
  user: User;
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

    if (title) {
      const titleElement = document.createElement('title');
      titleElement.innerText = title;
      document.head.appendChild(titleElement);
    }

    if (description) {
      this.addMeta({name: 'description', content: description});
    }

    if (keywords) {
      this.addMeta({name: 'keywords', content: keywords});
    }

    if (author) {
      this.addMeta({name: 'author', content: author.name});
    }

    if (title) {
      this.addMeta({property: 'og:title', content: title});
    }

    if (description) {
      this.addMeta({property: 'og:description', content: description});
    }

    if (images) {
      for (const {src, type, width, height, alt} of images) {
        this.addMeta({property: 'og:image', content: src});
        this.addMeta({property: 'og:image:type', content: type});
        this.addMeta({property: 'og:image:width', content: width});
        this.addMeta({property: 'og:image:height', content: height});
        this.addMeta({property: 'og:image:alt', content: alt});
      }
    }

    if (videos) {
      for (const {src, type, width, height} of videos) {
        this.addMeta({property: 'og:video', content: src});
        this.addMeta({property: 'og:video:type', content: type});
        this.addMeta({property: 'og:video:width', content: width});
        this.addMeta({property: 'og:video:height', content: height});
      }
    }

    if (audios) {
      for (const {src, type} of audios) {
        this.addMeta({property: 'og:audios', content: src});
        this.addMeta({property: 'og:audios:type', content: type});
      }
    }
  }

  public render() {
    const className = this.props.page ? block({page: this.props.page }) : block();

    return (
        <section className={this.props.className ? cn(className, this.props.className) : className }>
          {this.props.ssr ? <code data-extract={true} dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.metadata)}} /> : null}
          {this.props.metadata.h1 ? <h1>{this.props.metadata.h1}</h1> : null}
          {this.props.children}
        </section>
    );
  }

  private addMeta(params: {name?: string, content?: string, property?: string, lastModified?: string}) {
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
}

export default connect(
    (state: StoreTree, ownProps: OwnProps) => ({
      ...ownProps,
      csrf: state.session.csrf,
      user: state.session.user,
    }),
    (dispatch) => ({}),
)(App);
