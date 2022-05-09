import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function TitleDescription() {
    return (
        <div>
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                <Typography component="h1" variant="h2" align="center"
                    color="text.primary" gutterBottom >
                    Some Title
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    Deposit assets to earn interest
                </Typography>
            </Container>
        </div>)
}