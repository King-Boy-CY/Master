function pop(value: any) {
    return value.pop();
}
/**
 * @param direction 方向 默认为 1 -> Inbound 2 -> outbound
 * @param isDirection 是否需要 方向 不需要设为true则删除
 */
export const dateTrafficDate = (direction?: number, isDirection?: boolean) => {
    let field = ["trafficDateFrom", "trafficDateTo", { direction: direction || 1 }];
    if (isDirection) {
        pop(field)
    }
    return field
};
export const dateDate = (direction?: number, isDirection?: boolean) => {
    let field = ["beginDate", "endDate", { direction: direction || 1 }]
    if (isDirection) {
        pop(field)
    }
    return field;
};