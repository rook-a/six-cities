import { useParams } from 'react-router-dom';

import Header from '../../components/header/header';
import ReviewsForm from '../../components/review-form/review-form';
import Map from '../../components/map/map';
import PlacesList from '../../components/places-list/places-list';
import Bookmark from '../../components/boormark/boormark';

import { getFormatDate, getRatingPercent } from '../../const';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';

interface PropertyProps {
  isAuth: boolean;
  offers: Offer[];
  reviews: Review[];
}

const MAX_COUNT_OF_OFFERS = 3;

function Property({ isAuth, offers, reviews }: PropertyProps): JSX.Element {
  const offersNearby = offers.slice(0, MAX_COUNT_OF_OFFERS);

  const { id } = useParams();
  const currentOffer = offers.filter((offer) => offer.id === Number(id));

  const [{ bedrooms, maxAdults, type, title, price, rating, goods, images, host, description, isPremium, isFavorite }] =
    currentOffer;
  const { avatarUrl, isPro, name } = host;

  return (
    <div className="page">
      <Header isAuth={isAuth} />

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {images.map((currentSrc, index) => (
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
                <Bookmark isSmall={false} className={'property__bookmark-button'} isFavorite={isFavorite} />
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
                <b className="property__price-value">{price}</b>
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
              <section className="property__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
                </h2>
                <ul className="reviews__list">
                  {reviews.map((review) => {
                    const { comment, date, rating, user, id } = review;
                    const { avatarUrl, isPro, name } = user;

                    return (
                      <li className="reviews__item" key={id}>
                        <div className="reviews__user user">
                          <div className="reviews__avatar-wrapper user__avatar-wrapper">
                            <img
                              className="reviews__avatar user__avatar"
                              src={avatarUrl}
                              width="54"
                              height="54"
                              alt="Reviews avatar"
                            />
                          </div>
                          <span className="reviews__user-name">{name}</span>
                          {isPro && <span className="property__user-status">Pro</span>}
                        </div>
                        <div className="reviews__info">
                          <div className="reviews__rating rating">
                            <div className="reviews__stars rating__stars">
                              <span style={{ width: `${getRatingPercent(rating)}%` }}></span>
                              <span className="visually-hidden">Rating</span>
                            </div>
                          </div>
                          <p className="reviews__text">{comment}</p>
                          <time className="reviews__time" dateTime={date}>
                            {getFormatDate(date)}
                          </time>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {isAuth && <ReviewsForm />}
              </section>
            </div>
          </div>

          <Map className="property__map" />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <PlacesList offers={offersNearby} className={'near-places__list'} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Property;
