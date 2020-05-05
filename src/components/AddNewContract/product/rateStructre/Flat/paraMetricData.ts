export const columns = [{
    type: 'selection',
    width: 60,
    align: 'center'
},
{
    title: 'TimeBandName',
    dataIndex: 'timeBandName',
    width: 120,
    key: 'timeBandName'
},
{
    title: 'Day',
    children: [{
            title: 'From',
            dataIndex: 'dayFrom',
            width: 60,
            key: 'dayFrom',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.dayFrom)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.dayFrom)
                        })),
                    ])
                }
            }
        },
        {
            title: 'To',
            dataIndex: 'dayTo',
            width: 60,
            key: 'dayTo',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.dayTo)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.dayTo)
                        })),
                    ])
                }
            }
        },
    ]
},
{
    title: 'Weekday',
    children: [{
            title: 'From',
            dataIndex: 'weekdayFrom',
            width: 60,
            key: 'weekdayFrom',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.weekdayFrom)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.weekdayFrom)
                        })),
                    ])
                }
            }
        },
        {
            title: 'To',
            dataIndex: 'weekdayTo',
            width: 60,
            key: 'weekdayTo',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.weekdayTo)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.weekdayTo)
                        })),
                    ])
                }
            }
        },
    ]
},
{
    title: 'Specific time',
    children: [{
            title: 'From',
            dataIndex: 'timeFrom',
            width: 70,
            key: 'timeFrom',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.timeFrom)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.timeFrom)
                        })),
                    ])
                }
            }
        },
        {
            title: 'To',
            dataIndex: 'timeTo',
            width: 70,
            key: 'timeTo',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.timeTo)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.timeTo)
                        })),
                    ])
                }
            }
        },
    ]
},
{
    title: 'Type',
    dataIndex: 'type',
    width: 90,
    key: 'type',
    render: (h: any, params: any) => {
        if (params.row.detailList.length > 1) {
            return h('div', {
                attrs: {
                    class: 'subCol'
                },
            }, [
                h('ul', params.row.detailList.map((item: any) => {
                    return h('li', {}, item.type === 1 ? 'peak' : 'Offpeak')
                }))
            ]);
        } else {
            return h('div', {
                attrs: {
                    class: 'subCol'
                }
            }, [
                h('span', params.row.detailList.map((item: any) => {
                    return h('li', {}, item.type === 1 ? 'peak' : 'Offpeak')
                })),
            ])
        }
    }
},
{
    title: 'Modified by',
    dataIndex: 'modifiedBy',
    width: 100,
    key: 'modifiedBy',
},
{
    title: 'Last modified',
    dataIndex: 'lastModified',
    width: 115,
    key: 'lastModified',

}
];
export const ratingzone = [{
    CommitmentValue: {
        type: 'input',
        message: 'Commitment (Value) field should be no-null',
        initialValue: ['default'],
        required: true,
        name: 'CommitmentValue',
        decorator: 'CommitmentValue',
        disabled: false
    },
    Destination: {
        type: 'input',
        message: 'Destination field should be no-null',
        initialValue: [],
        disabled: false,
        required: true,
        options: null,
        name: 'Destination',
        decorator: 'Destination'
    },
    timeBand: {
        type: 'textarea',
        message: 'Time band field should be no-null',
        initialValue: '',
        required: true,
        name: 'Time band',
        decorator: 'timeBand',
        disabled: false,
        isInsert: false,
        isClear: true
    },
    inputcolumns: {
        type: 'tableCloums',
        options: [{
                title: 'No .',
                dataIndex: 'No',
                key: 'No'
            },
            {
                title: 'Rate',
                dataIndex: 'Rate',
                initialValue: '',
                require: true
            },
            {
                title: 'Chargable unit type',
                dataIndex: 'ChargableunitType',
                initialValue: '',
                require: true
            }
        ]
    },
    inputdata: {
        type: 'tableData',
        options: [{
            name: [{},
                {
                    type: 'input',
                    require: true,
                    initialValue: '',
                    decorator: 'Rate' + new Date().getTime()
                },
                {
                    type: 'select',
                    decorator: 'ChargableunitType0',
                    initialValue: '',
                    require: true,
                    options: [{
                            name: 'Secs',
                            value: 1,
                            disabled: false
                        },
                        {
                            name: 'Mins',
                            value: 2,
                            disabled: false
                        },
                        {
                            name: 'Quarters',
                            value: 3,
                            disabled: false
                        },
                        {
                            name: 'Call',
                            value: 4,
                            disabled: false
                        },
                        {
                            name: 'User',
                            value: 5,
                            disabled: false
                        },
                    ]
                }
            ],
            key: new Date().getTime()
        }],
        key: new Date().getTime()
    }
}];