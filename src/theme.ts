import {
	createMuiTheme
} from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			light: '#673ab7',
			main: '#212121',
			dark: '#212121',
			// contrastText: '#fff',
		},
		secondary: {
			light: '#303f9f',
			main: '#f44336',
			dark: '#fffafa',
			// contrastText: '#000',
		},

		background: {
			paper: "#424242",
			default: "#303030"
		},

		text: {
			primary: 'rgb(250, 250, 250)'
		}
	},

	shape: {
		borderRadius: 8
	},

	overrides: {
		MuiTextField: {
			root: {
				// color: '#fff',

			},
		},
		MuiFormLabel: {
			root: {

			},
		},
		MuiInputLabel: {
			root: {
				'&$focused': {
					color: 'rgb(250,250,250)'
				}
			},
		},
		MuiOutlinedInput: {
			root: {
				'&$focused $notchedOutline': {
					borderColor: 'rgb(250,250,250)',
				}
			}
		},
		MuiButton: {
			label: {
				color: 'rgb(250,250,250)'
			}
		},
		MuiSnackbarContent: {
			root: {
				backgroundColor: '#212121',
				color: 'rgb(250,250,250)'
			}
		},
		
	}
})

export default theme