import { useState } from 'react';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';

import { redirectToRoute } from '../../store/action';
import { fetchFavoritesAction, sendFavorite } from '../../store/favorites-slice/favorites-slice';
import { fetchOfferAction } from '../../store/offers-slice/offers-slice';
import { selectRequireAuthrization } from '../../store/user-slice/user-slice';

import { AppRoute, AuthorizationStatus } from '../../utils/const';
interface BookmarkProps {
  id: number;
  isSmall: boolean;
  className: string;
  isFavorite: boolean;
}

function Bookmark({ id, isSmall, className, isFavorite }: BookmarkProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectRequireAuthrization);
  const [favorite, setFavorite] = useState(isFavorite);

  const idAuth = authorizationStatus === AuthorizationStatus.Auth;

  const bookmark = {
    width: isSmall ? 18 : 31,
    height: isSmall ? 19 : 33,
  };

  const handleClick = () => {
    if (idAuth) {
      setFavorite(!favorite);
      dispatch(sendFavorite({ id, status: Number(!favorite) }));
      dispatch(fetchOfferAction(id));
      dispatch(fetchFavoritesAction());
    }

    dispatch(redirectToRoute(AppRoute.Login));
  };

  return (
    <button
      onClick={handleClick}
      className={cn('button', `${className}`, { 'place-card__bookmark-button--active': favorite })}
      type="button">
      <svg className="place-card__bookmark-icon" width={bookmark.width} height={bookmark.height}>
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">{favorite ? 'In bookmarks' : 'To bookmarks'}</span>
    </button>
  );
}

export default Bookmark;
