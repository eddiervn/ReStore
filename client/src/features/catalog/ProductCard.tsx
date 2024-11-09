import { Link } from "react-router-dom"
import { Product } from "../../app/models/product"
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from "react";
import agent from '../../app/api/agent';
import { useStoreContext } from "../../app/context/StoreContext";
import { formatCurrency } from "../../app/util/util";

interface Props{
    product: Product
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const {setBasket} = useStoreContext();

  function handleAddItem(){
    setLoading(true);
    agent.Basket.addItem(product.id)
    .then(basket => setBasket(basket))
    .catch(e => console.log(e))
    .finally(() => setLoading(false))
  }
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
        <LoadingButton size="medium" onClick={handleAddItem} loading={loading}>Add To Cart</LoadingButton>
        <Button size="medium" component={Link} to={`/catalog/${product.id}`}>Details</Button>
      </CardActions>
    </Card>   
  )
}

