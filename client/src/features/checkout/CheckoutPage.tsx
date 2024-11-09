import { Alert } from "@mui/material";

export default function CheckoutPage(){
  return (
    <>
        <Alert severity="warning" sx={{my:5}}>
            This page is available only to logged in users...
        </Alert>
    </>
  )
}