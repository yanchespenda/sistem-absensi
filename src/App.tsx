import React, { Fragment, useEffect, useState, Suspense } from 'react'
import {
  Router,
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom"
import history from "./history"
import axios from "axios"
import clsx from 'clsx'
import { getStorageItem } from './helper/localStorage'
import { SidenavList } from './interfaces'

import { makeStyles, Theme, createStyles, useTheme, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, LinearProgress, ListSubheader } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

import LoginComponent from "./components/login"
import OtherVerifyComponent from './components/other/verify'
import SidenavIconComponent from './components/other/sidenavIcon'

const DashboardComponent = React.lazy(() => import('./components/dashboard'))

axios.defaults.baseURL = 'http://127.0.0.1:3333'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
)

function App(props: any) {
  const classes = useStyles()
  const theme = useTheme()

  const [isLogged, setIsLogged] = useState(false)
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)
  const [isSidenavLoading, setIsSidenavLoading] = useState(false)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [sidenavList, setSidenavList] = useState<SidenavList[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')

  const getAuthToken = getStorageItem('token')
  if (getAuthToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken}`
  }

  const getSidenav = () => {
    setIsSidenavLoading(true)
    axios.get('api/user/sidenav').then( res => {
      console.log('sidenav', res)
      setSidenavList(res.data)
    }).catch( () => {
      
    }).then(() => {
      setIsSidenavLoading(false)
    })
  }

  useEffect(() => {
    const verifyToken = () => {
      setIsVerifyLoading(true)
      axios.get('auth/me').then( () => {
        setIsLogged(true)

        getSidenav()
      }).catch( () => {
        setIsLogged(false)
      }).then(() => {
        setIsVerifyLoading(false)
      })
    }
    
    verifyToken()
  }, [])

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const headerTitleHandle = (title: string) => {
    setHeaderTitle(title)
  }

  const getInitComponent = () => {
    return (
      <Fragment>
        <div className="layout-column">
          <div className={classes.root}>
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: drawerOpen,
              })}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={ handleDrawerOpen }
                  edge="start"
                  className={ clsx(classes.menuButton, drawerOpen && classes.hide) }
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  { headerTitle }
                </Typography>
                <div className="flex"></div>
                <IconButton aria-label="delete">
                  <AccountCircleIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer
              className={ classes.drawer }
              variant="persistent"
              anchor="left"
              open={ drawerOpen }
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              {
                sidenavList.map((item, idx) => {
                  const getChildrenCount = item.children?.length || 0
                  const getChildren = item.children || []

                  return (
                    <Fragment key={ idx }>
                      {
                        getChildrenCount > 0 ? (
                          <List
                            subheader={
                              <ListSubheader>
                                { item.title }
                              </ListSubheader>
                            }
                          >
                            {
                              getChildren.map((itemChild, idxChild) => {
                                return (
                                  <ListItem key={idxChild}>
                                    {
                                      itemChild.icon.enable ? <ListItemIcon><SidenavIconComponent icon={ itemChild.icon.name } /></ListItemIcon> : ''
                                    }
                                    <ListItemText primary={ itemChild.title } />
                                  </ListItem>
                                )
                              })
                            }
                          </List>
                        ) : (
                          <List>
                            <ListItem>
                              {
                                item.icon?.enable ? <ListItemIcon><SidenavIconComponent icon={ item.icon.name } /></ListItemIcon> : ''
                              }
                              <ListItemText primary={ item.title } />
                            </ListItem>
                          </List>
                        )
                      }
                    </Fragment>
                  )
                })
              }
            </Drawer>
            <main
              className={clsx(classes.content, {
                [classes.contentShift]: drawerOpen,
              })}
            >
              <div className={classes.drawerHeader}></div>
              <Suspense fallback={<div className="layout-row layout-align-center-center"><LinearProgress color="secondary" /></div>}>
                <Switch>
                  <Route exact path="/">
                    <DashboardComponent titleHandler={ headerTitleHandle } />
                  </Route>
                </Switch>
              </Suspense>
              
            </main>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Router history={ history }>
        <BrowserRouter>
          {
            isLogged ? getInitComponent() : isVerifyLoading ? <OtherVerifyComponent /> : <LoginComponent />
          }
        </BrowserRouter>
      </Router>
    </Fragment>
  )
}

export default App
