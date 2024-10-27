import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Product } from "../../app/models/product";
import axios from "axios";

export default function ProductDetails() {
  const {id} = useParams<{id: string}>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
    .then(response => setProduct(response.data))
    .catch(e => console.log(e))
    .finally(() => setLoading(false))
  },[id])

  if(loading)
    return  <p>Loading...'</p>
  
  if(!product)
    return <p>Product not found</p>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={4}>
        <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}}/>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="h3" sx={{fontWeight: 300, mb:1}}>{ product.name }</Typography>
        <Typography variant="h5" color="warning">${ (product.price / 100).toFixed(2) }</Typography>
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
      </Grid>
    </Grid>
  )
}
