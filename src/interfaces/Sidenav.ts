interface SidenavIcon {
    enable: boolean
    name: string
}
export interface SidenavListChildren {
    url: string
    title: string
    icon: SidenavIcon
}

export interface SidenavList {
    url: string
    title: string
    icon?: SidenavIcon
    children?: SidenavListChildren[]
}
