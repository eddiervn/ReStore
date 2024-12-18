import { Product } from "../../app/models/product";
import Grid from '@mui/material/Grid';
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props{
    products: Product[]
}

export default function ProductList({ products } : Props) {
  const {productsLoaded} = useAppSelector(state => state.catalog);
  return (
   <Grid container spacing={3}>
        { 
            products.map(product => (
                <Grid item xs={4} key={product.id}>
                    { productsLoaded && product?  <ProductCard product={product} /> : <ProductCardSkeleton/> }
                </Grid>
            )) 
        }
    </Grid>
  )
}

