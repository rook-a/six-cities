import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../index';
import { handleError } from '../../services/handle-error';

import { Offer } from '../../types/offer';
import { APIRoute, FetchStatus, NameSpace } from '../../utils/const';
import { State } from '../../types/state';

interface InitialState {
  favoriteOffers: Offer[];
  favoriteOffersStatus: FetchStatus;
  favoriteOffersError: boolean;
}

const initialState: InitialState = {
  favoriteOffers: [],
  favoriteOffersStatus: FetchStatus.Idle,
  favoriteOffersError: false,
};

interface sendFavoriteStatus {
  id: number;
  status: number;
}

export const fetchFavoritesAction = createAsyncThunk('data/fetchFavorites', async () => {
  try {
    const { data } = await api.get<Offer[]>(`${APIRoute.Favorites}`);
    return data;
  } catch (err) {
    handleError(err);
    throw err;
  }
});

export const sendFavorite = createAsyncThunk('user/sendReview', async ({ id, status }: sendFavoriteStatus) => {
  try {
    const { data } = await api.post<sendFavoriteStatus>(`${APIRoute.Favorites}/${id}/${status}`);
    return data;
  } catch (err) {
    handleError(err);
    throw err;
  }
});

export const favoritesSlice = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {},
  extraReducers: (buider) => {
    buider
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.favoriteOffersStatus = FetchStatus.Pending;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.favoriteOffersStatus = FetchStatus.Success;
        state.favoriteOffers = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.favoriteOffersStatus = FetchStatus.Failed;
        state.favoriteOffersError = true;
      })
      .addCase(sendFavorite.pending, (state) => {
        state.favoriteOffersStatus = FetchStatus.Pending;
      })
      .addCase(sendFavorite.fulfilled, (state) => {
        state.favoriteOffersStatus = FetchStatus.Success;
      })
      .addCase(sendFavorite.rejected, (state) => {
        state.favoriteOffersStatus = FetchStatus.Failed;
        state.favoriteOffersError = true;
      });
  },
});

const selectFavoritesState = (state: State) => state[NameSpace.Favorites];

export const selectFavoriteOffers = (state: State) => selectFavoritesState(state).favoriteOffers;
export const selectFavoriteOffersStatus = (state: State) => selectFavoritesState(state).favoriteOffersStatus;
