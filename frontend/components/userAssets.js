import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import ConnectMetamask from './connectMetamask';

import { sx_card, sx_header } from '../stile';
import TitleDescription from './titleDescription'

function a(){
  console.log("a")
}
function b() {
  console.log("b")
}

function Assets() {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            THESIS DAPP
          </Typography>
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            <ConnectMetamask />
          </Button>
        </Toolbar>
      </AppBar>
      {/* Title */}
      <TitleDescription />
      {/* */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={4} alignItems="flex-end">
          {/* */}
          <Grid item xs={4} sm={6} md={6}>
            <Card>
              <CardHeader title={"DAI"} subheader="2%" titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center'}} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="h6" color="text.primary">
                    <ul>
                      Balance: 1111
                    </ul>
                    <ul>
                      Deposited: 312321312
                    </ul>
                    <ul>
                      Earned:123
                    </ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button onClick={() => a()} fullWidth variant={"outlined"}>
                  Deposit{'  '}{ }
                </Button>
                <Button onClick={() => b()} fullWidth variant={"outlined"}>
                  withdraw{'  '}{ }
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {/* */}
        </Grid>
      </Container>

      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
      {/* End footer */}

    </React.Fragment>
  );
}

export default function UserAssets() {
  return <Assets />;
}