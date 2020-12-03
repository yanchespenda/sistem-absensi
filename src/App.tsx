import React, { Fragment, useEffect, useState, Suspense } from 'react'
import {
  Router,
  BrowserRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import history from "./history"
import axios from "axios"
import clsx from 'clsx'
import { getStorageItem, deleteStorageItem } from './helper/localStorage'
import { SidenavList, UserMenu } from './interfaces'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { makeStyles, Theme, createStyles, useTheme, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, LinearProgress, ListSubheader, CircularProgress } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import LoginComponent from "./components/login"
import OtherVerifyComponent from './components/other/verify'
import SidenavIconComponent from './components/other/sidenavIcon'
import OtherToolbarMenuComponent from './components/other/toolbarMenu'

const DashboardComponent = React.lazy(() => import('./components/dashboard'))

/* Admin */
const AdminUserComponent = React.lazy(() => import('./components/admin/user'))
const AdminAttedanceComponent = React.lazy(() => import('./components/admin/attedance'))
const AdminAttedanceViewComponent = React.lazy(() => import('./components/admin/attedance/view'))

/* Staff */ 
const StaffAttedanceComponent = React.lazy(() => import('./components/staff/attedance'))
const StaffAttedanceViewComponent = React.lazy(() => import('./components/staff/attedance/view'))

/* Karyawan */
const KaryawanAttendanceComponent = React.lazy(() => import('./components/karyawan/attendance'))
const KaryawanFacesComponent = React.lazy(() => import('./components/karyawan/faces'))
const KaryawanHistoryComponent = React.lazy(() => import('./components/karyawan/history'))

/* Account */
const AccountSettingComponent = React.lazy(() => import('./components/account/setting'))
const AccountAvatarComponent = React.lazy(() => import('./components/account/avatar'))


// axios.defaults.baseURL = 'http://127.0.0.1:3333' 
axios.defaults.baseURL = 'https://api.absensi.project.arproject.web.id'

const drawerWidth = 240

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
    drawerLoading: {
      height: '128px'
    },
    content: {
      flexGrow: 1,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
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

function App(_props: any) {
  const classes = useStyles()
  const theme = useTheme()

  const isExpand = useMediaQuery('(min-width:901px)')

  const [isLogged, setIsLogged] = useState(false)
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)
  const [isSidenavLoading, setIsSidenavLoading] = useState(false)
  // const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [sidenavList, setSidenavList] = useState<SidenavList[]>([])
  const [userMenu, setUserMenu] = useState<UserMenu>({avatar: undefined, menu: []})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')

  const getAuthToken = getStorageItem('token')
  if (getAuthToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken}`
  }

  const getSidenav = () => {
    setIsSidenavLoading(true)
    axios.get('api/user/sidenav').then( res => {
      setSidenavList(res.data)
    }).catch( () => {
      
    }).then(() => {
      setIsSidenavLoading(false)
    })
  }

  const getUserMenu = () => {
    // setIsLoadingAccount(true)
    axios.get('api/user/me').then( res => {
      // console.log('getUserMenu', res)
      setUserMenu(res.data)
    }).catch( () => {
      
    }).then(() => {
      // setIsLoadingAccount(false)
    })
  }

  useEffect(() => {
    const verifyToken = () => {
      setIsVerifyLoading(true)
      axios.get('auth/me').then( () => {
        setIsLogged(true)

        getSidenav()
        getUserMenu()
      }).catch( (err) => {
        if (err.response?.status === 401) {
          deleteStorageItem('token')
          delete axios.defaults.headers.common['Authorization']
        }
        setIsLogged(false)
      }).then(() => {
        setIsVerifyLoading(false)
      })
    }
    
    verifyToken()
  }, [])

  useEffect(() => {
    // console.log('isExpand', isExpand)
    setDrawerOpen(isExpand)
  }, [isExpand])

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const headerTitleHandle = (title: string) => {
    setHeaderTitle(title)
  }

  const getAppBar = () => {
    return (
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
          <OtherToolbarMenuComponent data={ userMenu } />
        </Toolbar>
      </AppBar>
    )
  }

  const getDrawer = () => {
    return (
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
          isSidenavLoading ? (
            <div className={[classes.drawerLoading, 'layout-row layout-align-center-center'].join(' ')}>
              <CircularProgress color={'secondary'} size="3rem" />
            </div>
          ) : ''
        }
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
                            <Link to={itemChild.url} key={idxChild}>
                              <ListItem>
                                {
                                  itemChild.icon.enable ? <ListItemIcon><SidenavIconComponent icon={ itemChild.icon.name } /></ListItemIcon> : ''
                                }
                                <ListItemText primary={ itemChild.title } />
                              </ListItem>
                            </Link>
                          )
                        })
                      }
                    </List>
                  ) : (
                    <List>
                      <Link to={item.url}>
                        <ListItem>
                          {
                            item.icon?.enable ? <ListItemIcon><SidenavIconComponent icon={ item.icon.name } /></ListItemIcon> : ''
                          }
                          <ListItemText primary={ item.title } />
                        </ListItem>
                      </Link>
                    </List>
                  )
                }
              </Fragment>
            )
          })
        }
      </Drawer>
    )
  }

  const getInitComponent = () => {
    return (
      <Fragment>
        <div className="layout-column">
          <div className={classes.root}>
            { getAppBar() }
            { getDrawer() }
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

                  {/* Admin */} 
                  <Route exact path={['/admin/users']} component={(props: any) => <AdminUserComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/admin/attendance']} component={(props: any) => <AdminAttedanceComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/admin/attendance/:id']} component={(props: any) => <AdminAttedanceViewComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>

                  {/* Staff */}
                  <Route exact path={['/staff/attendance']} component={(props: any) => <StaffAttedanceComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/staff/attendance/:id']} component={(props: any) => <StaffAttedanceViewComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>

                  {/* Karyawan */}
                  <Route exact path={['/attendance']} component={(props: any) => <KaryawanAttendanceComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/faces']} component={(props: any) => <KaryawanFacesComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/history']} component={(props: any) => <KaryawanHistoryComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  
                  {/* Account */}
                  <Route exact path={['/account/setting']} component={(props: any) => <AccountSettingComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  <Route exact path={['/account/avatar']} component={(props: any) => <AccountAvatarComponent {...props} titleHandler={ headerTitleHandle } />} ></Route>
                  
                  
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
            isLogged ? getInitComponent() : isVerifyLoading ? <OtherVerifyComponent useText={true} /> : <LoginComponent />
          }
        </BrowserRouter>
      </Router>
    </Fragment>
  )
}

export default App
