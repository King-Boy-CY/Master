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
        isAdd: false
    },
    inputcolumns: {
        options: [{
                title: 'No .',
                dataIndex: 'No',
                key: 'No'
            },
            {
                title: 'Tier from',
                dataIndex: 'Tierfrom',
                require: false
            },
            {
                title: 'Tier to',
                dataIndex: 'tireTo',
                require: false
            },
            {
                title: 'Rate',
                dataIndex: 'Rate',
                require: true
            },
            {
                title: 'Chargable unit type',
                dataIndex: 'ChargableunitType',
                require: true
            },
            {
                title: 'Band',
                dataIndex: 'Band',
                require: false
            }
        ]
    },
    inputdata: {
        type: 'tableCloums',
        options: [{
            name: [{},
                {
                    type: 'input',
                    decorator: 'Tierfrom0',
                    initialValue: '0'
                },
                {
                    type: 'input',
                    decorator: 'tireTo0',
                    initialValue: '+∞'
                },
                {
                    type: 'input',
                    decorator: 'Rate0',
                    initialValue: '',
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
                },
                {
                    type: 'input',
                    decorator: 'Band0',
                    initialValue: '',
                    disabled: true
                }

            ],
            key: 0
        }],
        key: 0
    }
}];