
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Card, Container, FormControl,FormLabel,TextField, Typography } from '@mui/material';
import { Link, useLocation} from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';
import { router } from '../../app/ruoter/Routes';
import { toast } from 'react-toastify';


export default function Login() {

 const dispatch = useAppDispatch();
 const location = useLocation();

 const {register, handleSubmit, formState:{isSubmitting, errors, isValid}} = useForm({
    mode: 'onTouched'
 });

 async function submitForm(data: FieldValues){
  try{
    await dispatch(signInUser(data));
    router.navigate(location.state?.from || '/catalog');
  }
  catch(e){
    console.log(e);
    toast.error('Failed to log in');
  }
 }
 
  return (
    <Container component={Card} variant="outlined" maxWidth="xs"
     sx={{display: "flex", flexDirection: "column", alignItems: "center", p:2}}>
        <Avatar sx={{my:1, mx:'auto', backgroundColor:'secondary.main'}} >
                <LockOutlined/>
        </Avatar>
        <Typography component="h1" variant='h5'>
            Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{mt:2}}>
            <FormControl fullWidth sx={{mb:2}}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                type="text"
                id="username"
                fullWidth
                autoFocus
                variant="outlined"
               {...register('username', {required: 'Username is required'})}
               error={!!errors.username}
               helperText={errors?.username?.message as string}
              />
            </FormControl>
            <FormControl fullWidth sx={{mb:2}}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                type="password"
                fullWidth
                variant="outlined"
                {...register('password', {required: 'Password is required'})}
                error={!!errors.password}
                helperText={errors?.password?.message as string}
              />
            </FormControl>
            <LoadingButton
              type="submit"
              fullWidth
              color="success"
              size='large'
              loading={isSubmitting}
              disabled={!isValid}
              variant="contained">
              Sign in
            </LoadingButton>
            <Box textAlign="center" sx={{mt:2}}>
                <Link to='/register'> 
                    Don't have an account? Sign up!
                </Link>
            </Box>
        </Box>
    </Container>
  );
}