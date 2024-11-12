import { Button, ButtonGroup, Typography } from "@mui/material"
import { decrement, increment } from "./counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
export default function Contact() {

    const dispatch = useAppDispatch();
    const {data, title} = useAppSelector(state => state.counter);

    return (
      <>
        <Typography variant="h5">{data}</Typography>
        <Typography variant="h5">{title}</Typography>
        <ButtonGroup>
          <Button variant="contained" color="error" onClick={() => dispatch(decrement(1))}>
              Decrement
          </Button>
          <Button variant="contained" color="success"  onClick={() => dispatch(increment(1))}>
              Increment
          </Button>
          <Button variant="contained" color="primary"  onClick={() => dispatch(increment(5))}>
              Increment by 5
          </Button>
        </ButtonGroup>
      </>
    )
  }