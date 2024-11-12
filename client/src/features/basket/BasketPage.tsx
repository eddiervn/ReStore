import { Box,  Button,  Grid,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Check, Delete, Remove } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { formatCurrency } from "../../app/util/util";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { 
  removeBasketItemAsync, 
  addBasketItemAsync, 
  CART_STATUS_PENDING_ADD_ITEM, 
  CART_STATUS_PENDING_REMOVE_ITEM,
  CART_STATUS_PENDING_DELETE_ITEM 
} from './basketSlice';
import BasketSummary from "./BasketSummary";


export default function BasketPage(){
 const {basket, pid, status} = useAppSelector(state => state.basket);
 const dispatch = useAppDispatch();

 if(!basket || basket.items.length === 0) 
    return <Typography variant="body2" textAlign="center">You basket is empty... </Typography>

  return (
    <>
    <TableContainer component={Paper} variant={'outlined'}>
      <Typography variant="h5" sx={{p:1}} color="primary">Your cart</Typography>
      <Table sx={{ minWidth: 650 }} aria-label="basket table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Subtotal</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map((item) => (
            <TableRow key={item.productId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Link to={`/catalog/${item.productId}`} style={{display:'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                  <img src={item.pictureUrl} width="60" style={{marginRight: '10px'}} alt={item.name}/>
                  {item.name}
                </Link>
              </TableCell>
              <TableCell align="center">${(item.price/100).toFixed(2)}</TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <LoadingButton variant="outlined" color="error" size="small" 
                    onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: 1}))} 
                    loading = {status === CART_STATUS_PENDING_REMOVE_ITEM && pid == item.productId}
                    sx={{minWidth: 'auto', padding:'3px'}}>
                    <Remove/>
                  </LoadingButton>
                   <h3 style={{display:'inline-block', margin:'0 10px', fontWeight: 400}}>{item.quantity}</h3>
                   <LoadingButton variant="outlined" color="success" size="small" 
                    onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))} 
                    loading = {status == CART_STATUS_PENDING_ADD_ITEM && pid == item.productId}
                   sx={{minWidth: 'auto',padding:'3px'}}>
                    <Add/>
                   </LoadingButton>
                </Box>
                </TableCell>
              <TableCell align="center">{formatCurrency(item.price * item.quantity)}</TableCell>
              <TableCell align="center">
                <LoadingButton variant="text" color="error" size="small" 
                   onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: item.quantity, deleting: true}))} 
                   loading = {status === CART_STATUS_PENDING_DELETE_ITEM && pid == item.productId}>
                   <Delete/>
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Grid container>
      <Grid item xs={6}/>
      <Grid item xs={6}>
        <BasketSummary/>
        <Button 
        variant="contained" 
        color="success" 
        component={ Link } 
        to="/checkout" sx={{mt:1}} 
        size="large" startIcon={<Check/>} fullWidth>
          Checkout
        </Button>
      </Grid>
    </Grid>
   
    </>
  )
}