import { Alert, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { formatCurrency } from "../../app/util/util";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
import { Check } from "@mui/icons-material";

export default function ProductDetails() {
  const {id} = useParams<{id: string}>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const {basket, setBasket, removeItem} = useStoreContext();
  const item = basket?.items.find(x => x.productId === product?.id);

  useEffect(() => {
    id && agent.Catalog.details(parseInt(id))
    .then(response =>  setProduct(response))
    .catch(e => console.log(e))
    .finally(() => setLoading(false))
  },[id])

  useEffect(() => setQuantity(item?.quantity ?? 1),[item])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const val = parseInt(event.currentTarget.value);
    if(val >= 0) setQuantity(val);
  }

  function handleUpdateCart(){

    if(!product || item?.quantity === quantity) return;

    setSubmitting(true);
    
    if(!item || quantity > item.quantity){
      // adding items
      const updatedQuantity = item? quantity - item.quantity : quantity;
      agent.Basket.addItem(product.id, updatedQuantity)
      .then(basket => setBasket(basket))
      .catch(e => console.log(e))
      .finally(() => setSubmitting(false))
    }
    else{
      // removing items
      const updatedQuantity = item.quantity - quantity;
      agent.Basket.removeItem(product.id, updatedQuantity)
      .then(() => removeItem(product.id, updatedQuantity))
      .catch(e => console.log(e))
      .finally(() => setSubmitting(false))
    }
  }


  if(loading)
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
              sx={{fontWeight: 400}} 
              loading = {submitting}
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
