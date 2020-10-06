import moment from "moment"

export function TimeLocal(date: string) {
    return moment(date).format('MMMM D YYYY, H:mm:ss')
}

