import { Product } from "../../app/models/product";
import Grid from '@mui/material/Grid';
import ProductCard from "./ProductCard";

interface Props{
    products: Product[]
}

export default function ProductList({ products } : Props) {
  return (
   <Grid container spacing={3}>
        { 
            products.map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard product={product} />
                </Grid>
            )) 
        }
    </Grid>
  )
}

