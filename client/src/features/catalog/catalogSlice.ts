import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

export const CATALOG_STATUS_IDLE = 'CATALOG_IDLE';
export const CATALOG_STATUS_FETCH_PRODUCTS_PENDING = 'CATALOG_FETCH_PRODUCTS_PENDING';
export const CATALOG_STATUS_FETCH_PRODUCT_PENDING = 'CATALOG_FETCH_PRODUCT_PENDING';

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try{
            return await agent.Catalog.list();
        }
        catch(e: any){
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try{
            return await agent.Catalog.details(productId)
        }
        catch(e: any){
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: CATALOG_STATUS_IDLE
    }),
    reducers: { },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, state => {
            state.status = CATALOG_STATUS_FETCH_PRODUCTS_PENDING
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = CATALOG_STATUS_IDLE;
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state,action) => {
            console.log(action.payload);
            state.status = CATALOG_STATUS_IDLE
        });

        builder.addCase(fetchProductAsync.pending, state => {
            state.status = CATALOG_STATUS_FETCH_PRODUCT_PENDING
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = CATALOG_STATUS_IDLE;
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = CATALOG_STATUS_IDLE;
        });
    })
});

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);





