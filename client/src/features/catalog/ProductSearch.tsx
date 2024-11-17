import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch(){
  const {productParams} = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((e: any) => {
        dispatch(setProductParams({searchTerm: e.target.value}));
    }, 1000 );

  return (
    <TextField 
    variant='outlined' 
    label="Search products..."
    inputRef={input => (input && searchTerm) && input.focus()}
    value={searchTerm || ''}
    onChange={(e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e);
    }}
     fullWidth/>
  )
}