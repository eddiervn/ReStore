import { Button, Container, Typography } from "@mui/material";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
     <Container sx={{py:4, textAlign: 'center'}}>
         <Typography sx={{ fontWeight: 300}} variant="h6">
            <SentimentVeryDissatisfiedIcon  fontSize="large"  />
            <br/>
            Oops, we could not find what you are looking for...
        </Typography>
        <Button type="small" component={Link} to='/catalog'>Go back to the shop</Button>
     </Container>
  )
}