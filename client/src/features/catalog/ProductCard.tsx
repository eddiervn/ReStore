import { Link } from "react-router-dom"
import { Product } from "../../app/models/product"
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"

interface Props{
    product: Product
}

export default function ProductCard({ product }: Props) {
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
        ${ (product.price / 100).toFixed(2) }
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
         { product.brand } / { product.type } 
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'space-between'}}>
        <Button size="small">Add To Cart</Button>
        <Button size="small" component={Link} to={`/catalog/${product.id}`}>Details</Button>
      </CardActions>
    </Card>   
  )
}

