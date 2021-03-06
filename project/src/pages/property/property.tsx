import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../components/header/header';

import Map from '../../components/map/map';
import PlacesList from '../../components/places-list/places-list';
import Bookmark from '../../components/boormark/boormark';
import Spinner from '../../components/spinner/spinner';
import Reviews from '../../components/reviews/reviews';
import NotFound from '../not-found/not-found';

import {
  fetchOfferAction,
  fetchOffersNearbyAction,
  selectOffer,
  selectOffersNearby,
  selectOffersNearbyStatus,
  selectOfferStatus,
} from '../../store/offers-slice/offers-slice';
import { selectRequireAuthrization } from '../../store/user-slice/user-slice';
import { fetchReviewsAction } from '../../store/review-slice/review-slice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { FetchStatus } from '../../utils/const';
import { getRatingPercent, isAuth, isPending } from '../../utils/utils';

const MIN_COUNT = 0;
const MAX_COUNT_OF_IMAGES = 6;

function Property(): JSX.Element | null {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  //App
  const authorizationStatus = useAppSelector(selectRequireAuthrization);
  //Offers
  const offer = useAppSelector(selectOffer);
  const offerStatus = useAppSelector(selectOfferStatus);
  const offersNearby = useAppSelector(selectOffersNearby);
  const offersNearbyStatus = useAppSelector(selectOffersNearbyStatus);

  const selectedOfferId = Number(id);

  useEffect(() => {
    dispatch(fetchOfferAction(selectedOfferId));
    dispatch(fetchReviewsAction(selectedOfferId));
    dispatch(fetchOffersNearbyAction(selectedOfferId));
  }, [selectedOfferId, dispatch]);

  if (isPending(offerStatus)) {
    return <Spinner className="loader" />;
  }

  if (offerStatus === FetchStatus.Failed) {
    return <NotFound />;
  }

  if (!offer) {
    return null;
  }

  const { bedrooms, maxAdults, type, title, price, rating, goods, images, host, description, isPremium, isFavorite } =
    offer;
  const { avatarUrl, isPro, name } = host;

  return (
    <div className="page">
      <Header isAuth={isAuth(authorizationStatus)} />

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {images.slice(MIN_COUNT, MAX_COUNT_OF_IMAGES).map((currentSrc, index) => (
                <div className="property__image-wrapper" key={index}>
                  <img className="property__image" src={currentSrc} alt="Shows an incredible place" />
                </div>
              ))}
            </div>
          </div>
          <div className="property__container container">
            <div className="property__wrapper">
              {isPremium && (
                <div className="property__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="property__name-wrapper">
                <h1 className="property__name">{title}</h1>
                <Bookmark
                  id={selectedOfferId}
                  isSmall={false}
                  className={'property__bookmark-button'}
                  isFavorite={isFavorite}
                />
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{ width: `${getRatingPercent(rating)}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">{rating}</span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">{type}</li>
                <li className="property__feature property__feature--bedrooms">{bedrooms} Bedrooms</li>
                <li className="property__feature property__feature--adults">Max {maxAdults} adults</li>
              </ul>
              <div className="property__price">
                <b className="property__price-value">&euro;{price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              <div className="property__inside">
                <h2 className="property__inside-title">What&apos;s inside</h2>
                <ul className="property__inside-list">
                  {goods.map((itemName) => (
                    <li className="property__inside-item" key={itemName}>
                      {itemName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="property__host">
                <h2 className="property__host-title">Meet the host</h2>
                <div className="property__host-user user">
                  <div className="property__avatar-wrapper property__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="property__avatar user__avatar"
                      src={avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="property__user-name">{name}</span>
                  {isPro && <span className="property__user-status">Pro</span>}
                </div>
                <div className="property__description">
                  <p className="property__text">{description}</p>
                </div>
              </div>
              <Reviews authorizationStatus={authorizationStatus} offerId={selectedOfferId} />
            </div>
          </div>

          <Map
            className="property__map"
            city={offer.city}
            offers={[...(offersNearby || []), offer]}
            selectedOffer={selectedOfferId}
          />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            {offersNearbyStatus === FetchStatus.Success && (
              <PlacesList offers={offersNearby || []} className={'near-places__list'} />
            )}

            {offersNearbyStatus === FetchStatus.Failed && (
              <p style={{ margin: '0', textAlign: 'center', color: '#FF0000' }}>
                There should be offers nearby here, but something went wrong. Try refreshing this page.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Property;
