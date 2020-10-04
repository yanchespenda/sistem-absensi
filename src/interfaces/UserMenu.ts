interface UserMenuIcon {
    enable: boolean
    name: string
}

export interface UserMenuItem {
    url: string
    title: string
    icon: UserMenuIcon
}

export interface UserMenu {
    avatar?: string
    menu: UserMenuItem[]
}
