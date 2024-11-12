import { Link } from "react-router-dom"
import { Product } from "../../app/models/product"
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import { formatCurrency } from "../../app/util/util";
import { addBasketItemAsync, CART_STATUS_PENDING_ADD_ITEM } from "../basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import LoadingButton from '@mui/lab/LoadingButton';

interface Props{
    product: Product
}

export default function ProductCard({ product }: Props) {
  const {status, pid} = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  
  return (
    <Card>
      <CardHeader avatar={
        <Avatar sx={{bgcolor: 'secondary.main'}}>
          {product.name.charAt(0).toUpperCase()}
        </Avatar>
      } title={product.name} titleTypographyProps={{sx: {fontWeight: 'bold', color: 'primary.main'}}}/>
      <CardMedia
        sx={{ height: 140, backgroundSize: 'contain' , bgcolor: '#03a9f4'}}
        image={ product.pictureUrl }
        title={ product.name } />
      <CardContent>
        <Typography variant="h5" color="warning">
        { formatCurrency(product.price)  }
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
         { product.brand } / { product.type } 
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'space-between'}}>
        <LoadingButton 
        size="medium"
         onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))} 
         loading={status === CART_STATUS_PENDING_ADD_ITEM && pid === product.id}>
          Add To Cart
        </LoadingButton>
        <Button size="medium" component={Link} to={`/catalog/${product.id}`}>Details</Button>
      </CardActions>
    </Card>   
  )
}

