import * as React from 'react';

import {graphql} from 'relay-runtime';

import {block as bem} from 'bem-cn';

import {Metadata} from 'models/metadata';
import {User} from 'models/user';

import {Props} from 'routers/index';

import App from 'components/App';

import {fetchGraphQL} from 'relay/fetchGraphQL';

import {UsersQuery} from '__generated__/UsersQuery.graphql';

const UsersQuery = graphql`
    query UsersQuery {
        users {
            id
            displayName
            facebook {id}
            google {id}
            twitter {id}
            yandex {id}
            vk {id}
            github {id}
        }
    }
`;

const Context = React.createContext({
  title: 'Pet project from Casual Chat video.',
  h1: 'Users'
});

const block = bem('users');

import './index.scss';

export default ({ssr, csrf}: Props) => {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    (async () => {
      const {data} = await fetchGraphQL<UsersQuery>(csrf, UsersQuery);

      setUsers([...data.users]);
    })();
  }, [UsersQuery]);

  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={{...metadata, h1: null}} page={block()} className={block()}>
              <div className={block('form')}>
                <h1 className={block('title')}>{metadata.h1}</h1>
                <div>
                  {users.map((user: User) => (
                      <div key={user.id}>
                        <p>{user.displayName}</p>
                      </div>
                  ))}
                </div>
              </div>
            </App>
        )}
      </Context.Consumer>
  );
}