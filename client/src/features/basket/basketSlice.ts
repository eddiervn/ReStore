import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

export const CART_STATUS_PENDING_ADD_ITEM = 'CART_PENDING_ADD_ITEM';
export const CART_STATUS_PENDING_REMOVE_ITEM = 'CART_PENDING_REMOVE_ITEM';
export const CART_STATUS_PENDING_DELETE_ITEM = 'CART_PENDING_DELETE_ITEM';
export const CART_STATUS_IDLE = 'CART_IDLE';

interface BasketState{
    basket: Basket | null,
    status: string,
    pid: number             // current product id being updated (handled)
}

const initialState: BasketState = {
    basket: null,
    status: 'idle',
    pid: 0
}

export const addBasketItemAsync = createAsyncThunk<Basket, {productId:number,quantity?: number}>(
    'basket/addBasketItemAsync', 
    async ({productId, quantity = 1}, thunkAPI) => {
        try{
            return await agent.Basket.addItem(productId, quantity);
        }
        catch(e: any){
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<void, {productId:number,quantity: number, deleting?: boolean}>(
'basket/removeBasketItemAsync', 
async ({productId, quantity}, thunkAPI) => {
    try{
        await agent.Basket.removeItem(productId, quantity);
    }
    catch(e : any){
        return thunkAPI.rejectWithValue({error: e.data});
    }
}
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.pid = action.meta.arg.productId;
            state.status = CART_STATUS_PENDING_ADD_ITEM;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = CART_STATUS_IDLE;
            state.pid = 0;
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = CART_STATUS_IDLE;
            state.pid = 0;
        });

        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.pid = action.meta.arg.productId;
            state.status = action.meta.arg.deleting ? CART_STATUS_PENDING_DELETE_ITEM : CART_STATUS_PENDING_REMOVE_ITEM;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            //remove item form basket state
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(x => x.productId === productId);
            if(itemIndex === -1 || itemIndex === undefined)
                return;

            const basketItem = state.basket?.items[itemIndex]!;

            basketItem.quantity -= quantity;
            if(basketItem.quantity <= 0)
                state.basket?.items.splice(itemIndex, 1);

            state.status = CART_STATUS_IDLE;
            state.pid = 0;
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = CART_STATUS_IDLE;
            state.pid = 0;
        })

    })
});

export const {setBasket} = basketSlice.actions;

