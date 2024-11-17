import { useEffect} from 'react'
import ProductList from "./ProductList";
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { 
   fetchFiltersAsync, 
   fetchProductsAsync, 
   productSelectors, 
   setProductParams,
   setPageNumber } from './catalogSlice';
import {Grid, Paper } from '@mui/material';
import ProductSearch from './ProductSearch';
import RadioButtonGroup from '../../app/components/RadioButtonGroup';
import CheckboxButtonGroup from '../../app/components/CheckboxButtonGroup';
import AppPagination from '../../app/components/AppPagination';

const sortOptions = [
   {value: 'name', label: 'Alphabetical'},
   {value: 'priceDesc', label: 'Price - High to Low'},
   {value: 'price', label: 'Price - Low to high'},
]

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);

  useEffect(() => {
     if(!productsLoaded) dispatch(fetchProductsAsync());
   }, [ productsLoaded, dispatch ])

   useEffect(() => {
      if(!filtersLoaded) dispatch(fetchFiltersAsync());
   }, [ filtersLoaded, dispatch ])


  if(!filtersLoaded || !metaData) 
      return <LoadingComponent message="Loading catalog"/>
 
  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
       <Grid item xs={3}>
            <Paper sx={{mb:2}} variant='outlined'>
               <ProductSearch/>
            </Paper>
            <Paper sx={{mb:2,px:2,py:1}} variant='outlined'>
               <RadioButtonGroup 
               options={sortOptions} 
               selectedValue={productParams.orderBy} 
               label='Sory By' 
               onChange={e => dispatch(setProductParams({orderBy: e.target.value}))}/>
            </Paper>
            <Paper sx={{mb:2,px:2, py:1}} variant='outlined'>
              <CheckboxButtonGroup 
              items={brands} 
              checkedItems={productParams.brands || []} 
              label='Brands'
              onChange={items => dispatch(setProductParams({brands: items}))}/>
            </Paper>
            <Paper sx={{mb:2,px:2,py:1}} variant='outlined'>
            <CheckboxButtonGroup 
              items={types} 
              checkedItems={productParams.types || []} 
              label='Product Typws'
              onChange={items => dispatch(setProductParams({types: items}))}/>
            </Paper>
       </Grid>
       <Grid item xs={9}>
            <ProductList products={products}/>
       </Grid>
       <Grid item xs={3}/>
       <Grid item xs={9}>
         <AppPagination 
            metaData={metaData} 
            onPageChange={(pageNumber : number) => dispatch(setPageNumber({pageNumber}))}/>
       </Grid>
    </Grid>
  )
}
