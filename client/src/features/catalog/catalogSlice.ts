import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

export const CATALOG_STATUS_IDLE = 'CATALOG_IDLE';
export const CATALOG_STATUS_FETCH_PRODUCTS_PENDING = 'CATALOG_FETCH_PRODUCTS_PENDING';
export const CATALOG_STATUS_FETCH_PRODUCT_PENDING = 'CATALOG_FETCH_PRODUCT_PENDING';
export const CATALOG_STATUS_FETCH_FILTERS_PENDING = 'CATALOG_FETCH_FILTERS_PENDING';

// --------------------------------------------------------------------------------------------------

const productsAdapter = createEntityAdapter<Product>();

interface CatelogState
{
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

// --------------------------------------------------------------------------------------------------

function getAxiosParams(productParams: ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());
    if(productParams.searchTerm)
        params.append('searchTerm', productParams.searchTerm);
    if(productParams.brands && productParams.brands.length > 0)
        params.append('brands', productParams.brands.toString());
    if(productParams.types?.length && productParams.types.length > 0)
        params.append('types', productParams.types.toString());
    return params;
}

// --------------------------------------------------------------------------------------------------

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try{
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetadata(response.metaData));
            return response.items;
        }
        catch(e: any){
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
);

// --------------------------------------------------------------------------------------------------

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
);

// --------------------------------------------------------------------------------------------------

export const fetchFiltersAsync = createAsyncThunk(
    'catalog/fetchFilters',
    async (_ , thunkAPI) => {
        try{
            return await agent.Catalog.filters()
        }
        catch(e : any){
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
) 

// --------------------------------------------------------------------------------------------------

function initParams(){
    return {
        orderBy: 'name',
        pageSize: 6,
        pageNumber: 1,
    }
}

// --------------------------------------------------------------------------------------------------

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState< CatelogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: CATALOG_STATUS_IDLE,
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setMetadata: (state, action) => {
            state.metaData = action.payload;
        }
     },
    extraReducers: (builder => {
        // products list handlers
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

        // single product handlers
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

        // filters handlers
        builder.addCase(fetchFiltersAsync.pending, state => {
            state.status = CATALOG_STATUS_FETCH_FILTERS_PENDING
        });
        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = CATALOG_STATUS_IDLE;
        });
        builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = CATALOG_STATUS_IDLE;
        });

    })
});

// --------------------------------------------------------------------------------------------------

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const {setProductParams, resetProductParams, setPageNumber, setMetadata} = catalogSlice.actions;





