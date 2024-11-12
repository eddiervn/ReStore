import { Alert, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { formatCurrency } from "../../app/util/util";
import { LoadingButton } from "@mui/lab";
import { Check, Delete } from "@mui/icons-material";
import { removeBasketItemAsync, addBasketItemAsync } from "../basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductAsync, productSelectors, CATALOG_STATUS_FETCH_PRODUCT_PENDING } from "./catalogSlice";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";


export default function ProductDetails() {
  const {id} = useParams<{id: string}>();
  const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)))
  const [quantity, setQuantity] = useState(0);
  const dispatch = useAppDispatch();
  const {basket, status, pid} = useAppSelector(state => state.basket);
  const {status: productStatus} = useAppSelector(state => state.catalog);
  const item = basket?.items.find(x => x.productId === product?.id);

  useEffect(() => {
    if(!product && id){
      dispatch(fetchProductAsync(parseInt(id)));
    }
  },[id, product, dispatch])

  useEffect(() => setQuantity(item?.quantity ?? 1),[item])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const val = parseInt(event.currentTarget.value);
    if(val >= 0) setQuantity(val);
  }

  function handleUpdateCart(){
    if(!product || item?.quantity === quantity) return;
    
    if(!item || quantity > item.quantity){
      // adding items
      const updatedQuantity = item? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({productId: product.id, quantity: updatedQuantity}));
    }
    else{
      // removing items
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({productId: product.id, quantity: updatedQuantity}));
    }
  }


  if(productStatus === CATALOG_STATUS_FETCH_PRODUCT_PENDING)
    return  <LoadingComponent message="Loading product details"/>
  
  if(!product)
    return <NotFound/>

  return (
    <>
    <Grid container component={Paper} variant={'outlined'} sx={{mt:3}}>
      <Grid item xs={12} sm={6} sx={{p:0}}>
        <img src={product.pictureUrl} alt={product.name} style={{width: '80%'}}/>
      </Grid>
      <Grid item xs={12} sm={6} sx={{p:2}}>
        <Typography variant="h3" sx={{fontWeight: 300, mb:1}}>{ product.name }</Typography>
        <Typography variant="h5" color="warning">{ formatCurrency(product.price) }</Typography>
        <p>{product.description}</p>
        <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Quantity In Stock</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid  container  sx={{py:2}} spacing={2}>
            <Grid item xs={12}>
              { item && (<Alert severity="success" icon={<Check fontSize="inherit"/>}>
              This product is in your cart ({item.quantity} items)
              </Alert>) }
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                variant="outlined" 
                type="number" 
                label={item ? 'Quantity in cart' : 'Quantity'} 
                value={quantity} 
                onChange={handleInputChange}
                fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6} display="flex">
              <LoadingButton 
              variant="contained" 
              size="large" 
              color={item && quantity == 0? 'warning' : 'success'} 
              startIcon = {item && quantity == 0? <Delete/> : <Check/>}
              sx={{fontWeight: 400}} 
              loading = {status.includes('PENDING') && pid == product.id}
              onClick = { handleUpdateCart}
              disabled = {item?.quantity === quantity || !item && quantity == 0}
              fullWidth>
                {item ? (quantity == 0? 'Remove from Cart' : 'Update Quantity') : 'Add to Cart'}
              </LoadingButton>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} textAlign="center">
          <Button type="small" component={Link} to='/catalog'>Back to catalog</Button>
    </Grid>
    </>
  )
}
