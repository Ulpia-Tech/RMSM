import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#0071CE',
            light: '#EBEFF8',
        },

        secondary: {
            main: '#F62407',
        },

        success: {
            main: '#14C846'
        },

        error: {
            main: '#F62407',
            dark: '#F72407',
        },

        warning: {
            main: '#F58B1B',
        },
        // selected cell
        info: {
            main: '#E9EEFA',
        },

        gray: {
            dark: '#49525C',
            main: '#77787C',
            light: '#F8F8F8',
        },

        fill: {
            main: '#E9F0FF',
        },
        background: {
            default: '#F5F5F5'
        }
    },
    typography: {
        fontFamily: ['Montserrat', 'sans-serif'].join(','),
        h1: {
            fontSize: 24.88,
            lineHeight: 42
        },
        h2: {
            fontSize: 20.74,
            lineHeight: 33
        },
        h3: {
            fontSize: 17.8,
            lineHeight: 21
        },
    },
    shape: {
        borderRadius: 3
    },
    spacing: 8,

    components: {

        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
                disableTouchRipple: true,
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    opacity: 1,
                    height: '35px',
                },

                outlined: {
                    '&:hover': {
                        backgroundColor: '#6CACE4',
                        color: '#fff',
                    }
                },

                contained: {
                    backgroundColor: '#0071CE',

                    "&:hover": {
                        backgroundColor: '#0072CEBF',
                    },
                    ":disabled": {
                        backgroundColor: '#DCDBDB',
                        color: '#fff',
                    }
                }
            },

            variants: [
                {
                    props: { variant: 'custom-contained' },
                    style: {
                        backgroundColor: '#f1f1f1',
                        color: '#ffff'
                    }
                }
            ],

            defaultProps: {
                disableElevation: true,
                disableFocusRipple: true,
                disableRipple: true,
            }
        },

        MuiFormControlLabel: { 
            styleOverrides: { 
                root: { 
                    marginRight: 10
                }
            }
        },

        MuiSwitch: { 
            styleOverrides: { 
                switchBase: { 
                    '&:hover': { 
                        backgroundColor: 'transparent !important'
                    },
                   
                },
            }
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    height: 50,
                }
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                }
            }
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {

                }
            }
        },


        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                }
            }
        },

        MuiMenu: {
            defaultProps: {
                disableAutoFocusItem: true
            }
        },

        MuiFilledInput: {
            styleOverrides: {
                input: {
                    padding: 15
                }
            },
            defaultProps: {
                disableUnderline: true
            }
        }
    }
})