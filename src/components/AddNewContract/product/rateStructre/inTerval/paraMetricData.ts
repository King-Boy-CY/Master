export const ratingzone =[{
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
        isAdd: false
    },
    inputcolumns: {
        type: 'tableCloums',
        options: [{
                title: 'No .',
                dataIndex: 'No',
                key: 'No'
            },
            {
                title: 'Interval',
                dataIndex: 'Interval',
                require: false
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
        type: 'tableCloums',
        options: [{
            name: [{},
                {
                    type: 'input',
                    decorator: 'Interval0',
                    initialValue: '+∞'
                },
                {
                    type: 'input',
                    decorator: 'Rate0',
                    require: true
                },
                {
                    type: 'select',
                    decorator: 'ChargableunitType0',
                    require: true,
                    options: [{
                            name: 'Secs',
                            disabled: false
                        },
                        {
                            name: 'Mins',
                            disabled: false
                        },
                        {
                            name: 'Quarters',
                            disabled: false
                        },
                        {
                            name: 'Call',
                            disabled: false
                        },
                        {
                            name: 'User',
                            disabled: false
                        },
                    ]
                }
            ],
            key: 0
        }],
        key: 0
    }
}];