import { Container, Divider, Paper, Typography} from "@mui/material"
import { useLocation } from "react-router-dom"

export default function ServerError() {

  const {state} = useLocation();

  return (
    <Container component={Paper} sx={{py:1}}>
        { state?.error? (
            <>
                 <Typography variant="h4" gutterBottom color="error" sx={{fontWeight: 300, mb:1}}>
                    {state.error.title}
                 </Typography>
                 <Divider sx={{my:1}}/>
                 <Typography variant="body2">
                        {state.error.detail || 'Internal Server Error'}
                 </Typography>
            </>
           
        ) :  <Typography variant="h5" gutterBottom color="error"  sx={{fontWeight: 300, mb:1}} textAlign="center">Server Error</Typography>
        }
    </Container>
  )
}
