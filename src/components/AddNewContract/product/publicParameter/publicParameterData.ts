export const base = [{
    Tips: 'Commitment',
    name: 'Commitment',
    initialValue: 'No',
    required: true,
    type: 'select',
    disabled: false,
    options: [{
        name: 'Yes'
    }, {
        name: 'No'
    }]
},
{
    Tips: 'Graceperiod',
    name: 'Grace period',
    required: false,
    disabled: false,
    showSearch: true,
    type: 'select',
    options: [{
        name: 'Yes'
    }, {
        name: 'No'
    }]
},
{
    Tips: 'GracePeriodcycle',
    name: 'Grace period cycle',
    showSearch: true,
    initialValue: [],
    required: false,
    disabled: false,
    type: 'tags',
    options: []
},
{
    Tips: 'AnyShortfall',
    name: 'Any shortfall',
    showSearch: true,
    required: false,
    disabled: false,
    type: 'select',
    options: [{
        name: 'Yes'
    }, {
        name: 'No'
    }]
},
{
    Tips: 'TrafficFrom',
    name: 'Traffic from (Value)',
    required: false,
    disabled: false,
    showSearch: true,
    type: 'input',
    initialValue: undefined
},
{
    Tips: 'TrafficFrom%',
    name: 'Traffic from (%)',
    required: false,
    disabled: false,
    type: 'input',
    initialValue: undefined
},
{
    Tips: 'TrafficForwardto',
    name: 'Traffic forward to',
    required: false,
    disabled: false,
    showSearch: true,
    type: 'select',
    options: [{
        name: 'Yes'
    }, {
        name: 'No'
    }]
},
{
    Tips: 'ForwardPeriodcycle',
    name: 'Forward period cycle',
    initialValue: [],
    required: false,
    disabled: false,
    showSearch: true,
    type: 'tags',
    options: []
},
{
    Tips: 'Anyexceed',
    name: 'Any exceed',
    required: false,
    disabled: false,
    showSearch: true,
    type: 'select',
    options: [{
        name: 'Yes'
    }, {
        name: 'No'
    }]
},
{
    Tips: 'Trafficforwardto',
    name: 'Traffic forward to (Value)',
    required: false,
    disabled: false,
    type: 'input',
    initialValue: undefined
},
{
    Tips: 'Trafficforwardto%',
    name: 'Traffic forward to (%)',
    required: false,
    disabled: false,
    type: 'input',
    initialValue: undefined
}
];
export const rating = [{
    Tips: 'TotalCommitmentValue',
    name: 'Total Commitment (value)',
    required: true,
    disabled: false,
    initialValue: '',
    type: 'input'
},
{
    Tips: 'CommitmentUnit',
    name: 'Commitment (unit)',
    required: true,
    disabled: false,
    type: 'select',
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
    }
    ],
    initialValue: undefined
},
{
    Tips: 'commitmentunitStartTime',
    name: 'Commitment start time',
    required: true,
    disabled: false,
    type: 'picker',
    initialValue: undefined
},
{
    Tips: 'commitmentunitendtTime',
    name: 'Commitment end time',
    required: true,
    disabled: false,
    type: 'picker',
    initialValue: undefined
},
{
    Tips: 'TierunitType',
    name: 'Tier unit type',
    required: true,
    disabled: true,
    type: 'select',
    options: null,
    initialValue: undefined
},
{
    Tips: 'IntervalunitType',
    name: 'Interval unit type',
    required: true,
    disabled: true,
    type: 'select',
    initialValue: undefined,
    options:null
}
];