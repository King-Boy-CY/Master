
// @ts-nocheck 忽略全文ts检测
import contractIcon from "public/img/menu/contract.svg"
import configationIcon from "public/img/menu/config.svg"
import financeIcon from "public/img/menu/finance.svg"
import routeIcon from "public/img/menu/Route Info.svg"
import tradeIcon from "public/img/menu/trade.svg"

interface IconType {
    [k: string]: string
}
const icons: IconType = {
    contractIcon,
    configationIcon,
    financeIcon,
    routeIcon,
    tradeIcon
}
export {
    icons
}