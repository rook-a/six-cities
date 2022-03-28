import { MouseEvent } from 'react';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';

import { redirectToRoute } from '../../store/action';
import { changeFavoriteStatus, selectChangeFavoriteStatus } from '../../store/favorites-slice/favorites-slice';

import { selectRequireAuthrization } from '../../store/user-slice/user-slice';

import { AppRoute, AuthorizationStatus, FetchStatus } from '../../utils/const';

import styles from './bookmark.module.css';
interface BookmarkProps {
  id: number;
  isSmall: boolean;
  className: string;
  isFavorite: boolean;
}

function Bookmark({ id, isSmall, className, isFavorite }: BookmarkProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectRequireAuthrization);
  const favoriteStatus = useAppSelector(selectChangeFavoriteStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;
  const isPending = favoriteStatus === FetchStatus.Pending;

  const bookmark = {
    width: isSmall ? 18 : 31,
    height: isSmall ? 19 : 33,
  };

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    if (isAuth) {
      dispatch(changeFavoriteStatus({ id, status: Number(!isFavorite) }));
    } else {
      dispatch(redirectToRoute(AppRoute.Login));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'button',
        `${className}`,
        { 'place-card__bookmark-button--active': isFavorite },
        { [styles['button--pending']]: isPending },
      )}
      type="button"
      disabled={isPending}>
      <svg className="place-card__bookmark-icon" width={bookmark.width} height={bookmark.height}>
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
    </button>
  );
}

export default Bookmark;
