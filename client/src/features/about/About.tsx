import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material"
import agent from "../../app/api/agent"
import { useState } from "react"

export default function About() {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  function getValidationErrors(){
    agent.TestErrors.getValidationError()
    .then(_ => console.log('You should not see this'))
    .catch(e => setValidationErrors(e))
  }

  return (
    <Container>
        <Typography variant="h3" textAlign="center"  sx={{fontWeight: 300, mb:1}}>Errors for testing purposes</Typography>
        <ButtonGroup fullWidth sx={{mb:5}}>
          <Button color="error" onClick={() => agent.TestErrors.get400Error().catch(e => console.log(e))}>Test 400 Error</Button>
          <Button color="error" onClick={() => agent.TestErrors.get401Error().catch(e => console.log(e))}>Test 401 Error</Button>
          <Button color="error" onClick={() => agent.TestErrors.get404Error().catch(e => console.log(e))}>Test 404 Error</Button>
          <Button color="error" onClick={() => agent.TestErrors.get500Error().catch(e => console.log(e))}>Test 500 Error</Button>
          <Button color="error" onClick={getValidationErrors}>Test Validation Error</Button>
        </ButtonGroup>
        {validationErrors.length > 0 && <Alert severity="error" variant="outlined" sx={{bgcolor: '#fff'}}>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
               {validationErrors.map((e, i) => <ListItem  key={i}>{e}</ListItem>)}
          </List>
          </Alert>}
    </Container>
  )
}

