import { Box,  Button,  Grid,  IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { formatCurrency } from "../../app/util/util";

export default function BasketPage(){

const {basket, setBasket, removeItem} = useStoreContext();
const [status, setStatus] = useState({
  loading: false,
  action: '',
  productId: 0
});

function handleAddItem(productId : number)
{
    setStatus({loading: true, action: 'add',  productId});
    agent.Basket.addItem(productId)
    .then(basket => setBasket(basket))
    .catch(e => console.log(e))
    .finally(() => setStatus({loading: false, action: '', productId: 0}))
}

function handleRemoveItem(productId : number, quantity: number = 1, action = 'remove'){
  setStatus({loading: true, action, productId});
  agent.Basket.removeItem(productId, quantity)
  .then(() => removeItem(productId, quantity))
  .catch(e => console.log(e))
  .finally(() => setStatus({loading: false, action: '', productId: 0}))
}


 if(!basket || basket.items.length === 0) return <Typography variant="body2" textAlign="center">You basket is empty...</Typography>

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
                    onClick={() => handleRemoveItem(item.productId)} 
                    loading = {status.loading && status.action == 'remove' && status.productId == item.productId}
                    sx={{minWidth: 'auto', padding:'3px'}}>
                    <Remove/>
                  </LoadingButton>
                   <h3 style={{display:'inline-block', margin:'0 10px', fontWeight: 400}}>{item.quantity}</h3>
                   <LoadingButton variant="outlined" color="success" size="small" 
                    onClick={() => handleAddItem(item.productId)} 
                    loading = {status.loading && status.action == 'add' && status.productId == item.productId}
                   sx={{minWidth: 'auto',padding:'3px'}}>
                    <Add/>
                   </LoadingButton>
                </Box>
                </TableCell>
              <TableCell align="center">{formatCurrency(item.price * item.quantity)}</TableCell>
              <TableCell align="center">
                <LoadingButton variant="text" color="error" size="small" 
                   onClick={() => handleRemoveItem(item.productId, item.quantity, 'delete')} 
                   loading = {status.loading && status.action == 'delete' && status.productId == item.productId}>
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
        <Button variant="contained" color="success" component={ Link } to="/checkout" sx={{mt:1}} size="large" fullWidth>Checkout</Button>
      </Grid>
    </Grid>
   
    </>
  )
}