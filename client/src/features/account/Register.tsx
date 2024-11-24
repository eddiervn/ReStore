import { Person } from '@mui/icons-material';
import { Avatar, Box, Card, Container, FormControl,FormLabel,TextField, Typography } from '@mui/material';
import { Link, useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';


export default function Register() {

  const navigate = useNavigate();

  const {register, handleSubmit, setError, formState:{isSubmitting, errors, isValid}} = useForm({
    mode: 'onTouched'
  });

  function handleApiErrors(errors: any){
    console.log(errors)
    if(errors){
      errors.forEach((error: string) => {
        if(error.includes('Password')){
          setError('password',{message: error});
        }
        else if(error.includes('Username')){
          setError('username',{message: error});
        }
        else if(error.includes('Email')){
          setError('email',{message: error});
        }
      })
    }
  }

  return (
    <Container component={Card} variant="outlined" maxWidth="xs"
     sx={{display: "flex", flexDirection: "column", alignItems: "center", p:2}}>
        <Avatar sx={{my:1, mx:'auto', backgroundColor:'secondary.main'}} >
              <Person/>
        </Avatar>
        <Typography component="h1" variant='h5'>
            Register
        </Typography>
        <Box component="form" onSubmit={
          handleSubmit(data => agent.Accont.register(data)
          .then(() => {
            toast.success('Registration successful, you can login now');
            navigate('/login');
          })
          .catch(error => handleApiErrors(error)))} sx={{mt:2}}>
            <FormControl fullWidth sx={{mb:2}}>
              <FormLabel htmlFor="username" sx={errors.username && {'color': '#d32f2f'}}>Username</FormLabel>
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
              <FormLabel htmlFor="email" sx={errors.email && {'color': '#d32f2f'}}>Email</FormLabel>
              <TextField
                type="email"
                id="email"
                fullWidth
                variant="outlined"
               {...register('email', {
                  required: 'Email is required', 
                  pattern: {
                    value: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/, 
                    message: 'Not a valid email address'}})}
               error={!!errors.email}
               helperText={errors?.email?.message as string}
              />
            </FormControl>
            <FormControl fullWidth sx={{mb:2}}>
              <FormLabel htmlFor="password" sx={errors.pawwword && {'color': '#d32f2f'}}>Password</FormLabel>
              <TextField
                id="password"
                type="password"
                fullWidth
                variant="outlined"
                {...register('password', {required: 'Password is required',
                   minLength:{value:5, message:'Password must be at least 5 characters'}})}
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
              Register
            </LoadingButton>
            <Box textAlign="center" sx={{mt:2}}>
                <Link to='/login'> 
                    Already have an account? Sign in!
                </Link>
            </Box>
        </Box>
    </Container>
  );
}