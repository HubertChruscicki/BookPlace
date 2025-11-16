import { styled } from '@mui/material/styles';
import {AppBar, Toolbar, Button} from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: '64px',
    width: '100%',
    maxWidth: '1600px',
    marginLeft: 'auto',
    marginRight: 'auto',

        [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        minHeight: '70px',
    },

    [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
}));



export const UserButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    textTransform: 'none',
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

export const SignInButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    minWidth: '100px',
    borderRadius: '20px',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    fontWeight: 500,
}));

export const SignUpButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    minWidth: '100px',
    borderRadius: '20px',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontWeight: 500,
    '&:hover': {
        borderColor: theme.palette.primary.dark,
    },
}));