import { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { getUser } from '../../services/user';
import { logoutAction } from '../../store/user-slice/user-slice';

interface NavProps {
  isAuth?: boolean;
}

function Nav({ isAuth }: NavProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { avatarUrl, email } = getUser();

  const titleLink = isAuth ? 'Favorites' : 'Sigh in';

  const handleClick = (evt: SyntheticEvent) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <Link className="header__nav-link header__nav-link--profile" to="/favorites" title={titleLink}>
            <div
              className="header__avatar-wrapper user__avatar-wrapper"
              style={{ backgroundImage: `url(${avatarUrl})`, borderRadius: '50%' }}
            />
            {isAuth ? (
              <span className="header__user-name user__name">{email}</span>
            ) : (
              <span className="header__login">Sign in</span>
            )}
          </Link>
        </li>
        {isAuth && (
          <li className="header__nav-item">
            <Link onClick={handleClick} className="header__nav-link" to="/" title="Sign out">
              <span className="header__signout">Sign out</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
