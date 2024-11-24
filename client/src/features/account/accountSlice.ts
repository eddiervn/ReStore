import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/ruoter/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkApi) => {
        try{
            const userDto = await agent.Accont.login(data);
            const {basket, ...user} = userDto;
            console.log(user);
            if(basket) thunkApi.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch(e: any){
            return thunkApi.rejectWithValue({ error: e.value })
        }
    } 
);

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkApi) => {
        thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try{
            const userDto = await agent.Accont.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkApi.dispatch(setBasket(basket));
            // override local starage user
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch(e: any){
            return thunkApi.rejectWithValue({ error: e.value })
        }
    } ,
    {
        condition: () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut : state => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
       
        builder.addCase(signInUser.fulfilled, (state, action) => {
            state.user = action.payload;
            toast.success('You are logged in!');
        });
        builder.addCase(signInUser.rejected, (_, action) => {
            console.log(action.payload);
            throw action.payload;
        });

        builder.addCase( fetchCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired, please login');
            router.navigate('/');
        });

    })
});

export const {signOut, setUser} = accountSlice.actions