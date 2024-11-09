import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props{
    message?: string
}

export default function LoadingComponent({ message = 'Loading' }: Props){
  return (
    <Backdrop open={true} invisible={true}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Box textAlign="center">
                <CircularProgress size={60} color="warning"/>
                <Typography variant="h5" sx={{fontWeight: 300}}>{message}</Typography>
            </Box>
        </Box>
    </Backdrop>
  )
}