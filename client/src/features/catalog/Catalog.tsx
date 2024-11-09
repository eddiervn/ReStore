import { useEffect, useState } from 'react'
import { Product } from "../../app/models/product"
import ProductList from "./ProductList";
import agent from '../../app/api/agent';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     agent.Catalog.list()
     .then(response => setProducts(response))
     .catch(e => console.log(e))
     .finally(() => setLoading(false))
  }, [])

  if(loading) return <LoadingComponent message="Loading catalog"/>
 
  return (
    <>
       <ProductList products={products}/>
    </>
  )
}
