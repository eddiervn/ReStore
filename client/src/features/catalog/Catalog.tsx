import { useEffect} from 'react'
import ProductList from "./ProductList";
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { CATALOG_STATUS_FETCH_PRODUCTS_PENDING, fetchProductsAsync, productSelectors } from './catalogSlice';

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, status } = useAppSelector(state => state.catalog);

  useEffect(() => {
     if(!productsLoaded)
        dispatch(fetchProductsAsync());
     }, [productsLoaded, dispatch])

  if(status === CATALOG_STATUS_FETCH_PRODUCTS_PENDING) return <LoadingComponent message="Loading catalog"/>
 
  return (
    <>
       <ProductList products={products}/>
    </>
  )
}
