import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import dogService from '../../services/dogService';

// Fetch dogs with filters
export const fetchDogs = createAsyncThunk(
  'dogs/fetchDogs',
  async ({ filters, page, size, sort }, { rejectWithValue }) => {
    try {
      // Ensure sort has a default value if not provided
      const sortOption = sort || 'breed:asc';
      
      // Call the search API to get dog IDs
      const searchResults = await dogService.searchDogs(filters, page, size, sortOption);
      
      if (!searchResults.resultIds || searchResults.resultIds.length === 0) {
        return {
          dogs: [],
          total: 0,
          resultIds: [],
          next: null,
          prev: null
        };
      }
      
      // Fetch details for each dog ID
      const dogs = await dogService.getDogsByIds(searchResults.resultIds);
      
      return {
        dogs,
        total: searchResults.total,
        resultIds: searchResults.resultIds,
        next: searchResults.next,
        prev: searchResults.prev
      };
    } catch (error) {
      console.error('Error in fetchDogs thunk:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch dogs. Please try again later.'
      );
    }
  }
);

// Fetch all available dog breeds
export const getBreeds = createAsyncThunk(
  'dogs/getBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const breeds = await dogService.getBreeds();
      return breeds;
    } catch (error) {
      return rejectWithValue('Failed to fetch breeds. Please try again later.');
    }
  }
);

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [],
    resultIds: [],
    total: 0,
    breeds: [],
    filters: {
      breeds: [],
      ageMin: undefined,
      ageMax: undefined,
      zipCodes: undefined,
    },
    sortOption: '',
    isLoading: false,
    isLoadingBreeds: false,
    error: null,
    page: 0,
    next: null,
    prev: null,
    pageSize: 25
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...action.payload };
      state.page = 0; // Reset page on filter change
    },
    clearFilters: (state) => {
      state.filters = {
        breeds: [],
        ageMin: undefined,
        ageMax: undefined,
        zipCodes: undefined,
      };
      state.page = 0;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 0; // Reset page when changing page size
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDogs reducers
      .addCase(fetchDogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dogs = action.payload.dogs;
        state.total = action.payload.total;
        state.resultIds = action.payload.resultIds;
        state.next = action.payload.next;
        state.prev = action.payload.prev;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dogs';
        state.dogs = [];
      })
      // getBreeds reducers
      .addCase(getBreeds.pending, (state) => {
        state.isLoadingBreeds = true;
        state.error = null;
      })
      .addCase(getBreeds.fulfilled, (state, action) => {
        state.isLoadingBreeds = false;
        state.breeds = action.payload;
      })
      .addCase(getBreeds.rejected, (state, action) => {
        state.isLoadingBreeds = false;
        state.error = action.payload || 'Failed to fetch breeds';
      });
  }
});

export const { setFilters, clearFilters, setSortOption, setPage, setPageSize } = dogsSlice.actions;

// Memoized selectors
export const selectDogs = state => state.dogs.dogs;
export const selectFilters = state => state.dogs.filters;
export const selectSortOption = state => state.dogs.sortOption;
export const selectIsLoading = state => state.dogs.isLoading;
export const selectError = state => state.dogs.error;
export const selectPagination = state => ({
  page: state.dogs.page,
  pageSize: state.dogs.pageSize,
  total: state.dogs.total
});

// Memoized filtered and sorted dogs selector
export const selectFilteredDogs = createSelector(
  [selectDogs, selectFilters, selectSortOption],
  (dogs, filters, sortOption) => {
    // The selector will only recalculate when dogs, filters, or sortOption changes
    return dogs;
  }
);

export default dogsSlice.reducer; 