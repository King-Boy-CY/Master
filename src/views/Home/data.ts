// 表头
export const lCAccountColumns: any = [
    {
        title: 'Account',
        dataIndex: 'Account',
        key: 'Account',
    }, {
        title: 'Credit',
        dataIndex: 'Credit',
        key: 'Credit',
    },
    {
        title: '7days charge',
        dataIndex: 'seventhDaysCharge',
        key: 'seventhDaysCharge',
        scopedSlots: {
            customRender: 'echarts1'
        },
    }, {
        title: '7days volume',
        dataIndex: 'seventhDaysVolume',
        key: 'seventhDaysVolume',
        // width: 120,
        scopedSlots: {
            customRender: 'echarts'
        },
    }]

export const costFluctuationColumns: Array<Object> = [
    {
        title: 'Destination',
        dataIndex: 'Destination',
        key: 'Destination',
        // width: 140
    }, {
        title: 'Current',
        dataIndex: 'Current',
        key: 'Current',
        width: 70
    }, {
        title: 'Previous',
        dataIndex: 'Previous',
        key: 'Previous',
        width: 70
    }, {
        title: 'X%',
        dataIndex: 'percent',
        key: 'percent',
    }, {
        title: '7days volume',
        dataIndex: 'seventhDaysVolume',
        key: 'seventhDaysVolume',
        width: 80,
        scopedSlots: {
            customRender: 'echarts'
        },
    }
]

export const fluctuationDestColumns: Array<Object> = [
    {
        title: 'Destination',
        dataIndex: 'Destination',
        key: 'Destination',
        // width: 140,
    }, {
        title: '12-Sep',
        dataIndex: '12-Sep',
        key: '12-Sep',
        width: 70
    }, {
        title: '11-Sep',
        dataIndex: '11-Sep',
        key: '11-Sep',
        width: 70
    }, {
        title: 'X%',
        dataIndex: 'percent',
        key: 'percent',
    }, {
        title: '7days volume',
        dataIndex: 'seventhDaysVolume',
        key: 'seventhDaysVolume',
        width: 80,
        scopedSlots: {
            customRender: 'echarts'
        },
    }]

export const fluctuationAccColumns: Array<Object> = [
    {
        title: 'Destination',
        dataIndex: 'Destination',
        key: 'Destination',
        // width: 140,
    }, {
        title: '12-Sep',
        dataIndex: '12-Sep',
        key: '12-Sep',
        width: 70
    }, {
        title: '11-Sep',
        dataIndex: '11-Sep',
        key: '11-Sep',
        width: 70
    }, {
        title: 'X%',
        dataIndex: 'percent',
        key: 'percent',
    }, {
        title: '7days volume',
        dataIndex: 'seventhDaysVolume',
        key: 'seventhDaysVolume',
        width: 80,
        scopedSlots: {
            customRender: 'echarts'
        },
    }]

export const dataSelectOptions: Array<Object> = [
    {
        name: '2019/9/12',
        value: '2019/9/12'
    },
    {
        name: '2019/9/11',
        value: '2019/9/11'
    },
    {
        name: '2019/9/10',
        value: '2019/9/10'
    },
    {
        name: '2019/9/09',
        value: '2019/9/09'
    }
]
// 表格echarts option
export const commonTableOption: object = {
    color: ['#0068FE', '#2F4371', '#19A8D8'],
    tooltip: {
        // trigger: 'axis',
        trigger: 'none',
        formatter: "{b}: {c}"
    },
    grid: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '3',
        // containLabel: true
    },
    xAxis: {
        type: 'category',
        show: false,
        axisLabel: {
            interval: 0,
        },
        data: ['5-Sep', '6', '7', '8', '9', '10', '11-Sep']
    },
    yAxis: [{
        show: false,
        type: 'value',
        name: 'Error CDR values',
        nameLocation: 'center',
        nameTextStyle: {
            padding: [0, 0, 30, 0],
            // fontWeight: 600,
        }
    }],
    series: [{
        data: [46, 500, 116, 50, 75, 26, 152],
        type: 'line'
    }]
};

// 表头对应数据
const lCAccountDataAssign = (data: object): object => {
    return Object.assign({}, commonTableOption, {
        series: [{
            data,
            type: 'line'
        }]
    })
}

export const lCAccountData: object = [
    {
        key: 0,
        Account: 'Afeef',
        Credit: '22.38989644',
        seventhDaysCharge: [834, 724, 420, 284, 184, 815, 671],
        [Symbol.for('option1')]: lCAccountDataAssign([834, 724, 420, 284, 184, 815, 671]),
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])

    }, {
        key: 1,
        Account: 'Beer',
        Credit: '81.51632707',
        seventhDaysCharge: [108, 677, 576, 674, 111, 642, 126],
        [Symbol.for('option1')]: lCAccountDataAssign([108, 677, 576, 674, 111, 642, 126]),
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 2,
        Account: 'VEW',
        Credit: 676.9513105,
        seventhDaysCharge: [908, 859, 943, 713, 937, 43, 115],
        [Symbol.for('option1')]: lCAccountDataAssign([908, 859, 943, 713, 937, 43, 115]),
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([23, 333, 44, 24, 44, 556, 67]),
    },
    {
        key: 3,
        Account: 'Cail',
        Credit: 423.1122969,
        seventhDaysCharge: [165, 436, 116, 492, 716, 970, 383],
        [Symbol.for('option1')]: lCAccountDataAssign([165, 436, 116, 492, 716, 970, 383]),
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775]),
    },
    {
        key: 4,
        Account: 'Deqoe',
        Credit: 628.7326767,
        seventhDaysCharge: [812, 101, 977, 139, 604, 87, 203],
        [Symbol.for('option1')]: lCAccountDataAssign([812, 101, 977, 139, 604, 87, 203]),
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857]),

    },
    {
        key: 5,
        Account: 'Fkieir',
        Credit: 100.7658938,
        seventhDaysCharge: [239, 637, 855, 691, 176, 478, 204],
        [Symbol.for('option1')]: lCAccountDataAssign([239, 637, 855, 691, 176, 478, 204]),
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275]),

    },
    {
        key: 6,
        Account: 'FEe22',
        Credit: 216.5587581,
        seventhDaysCharge: [258, 51, 888, 194, 631, 494, 463],
        [Symbol.for('option1')]: lCAccountDataAssign([258, 51, 888, 194, 631, 494, 463]),
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451]),
    },
    {
        key: 7,
        Account: 'E#34',
        Credit: 464.5755033,
        seventhDaysCharge: [986, 421, 263, 267, 752, 638, 43],
        [Symbol.for('option1')]: lCAccountDataAssign([986, 421, 263, 267, 752, 638, 43]),
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565]),

    }, {
        key: 8,
        Account: 'Ytiife',
        Credit: 212.9979098,
        seventhDaysCharge: [629, 474, 295, 725, 605, 898, 165],
        [Symbol.for('option1')]: lCAccountDataAssign([629, 474, 295, 725, 605, 898, 165]),
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675]),
    }, {
        key: 9,
        Account: 'Feew',
        Credit: 526.4596107,
        seventhDaysCharge: [86, 375, 357, 510, 475, 463, 713],
        [Symbol.for('option1')]: lCAccountDataAssign([86, 375, 357, 510, 475, 463, 713]),
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2]),

    }, {
        key: 10,
        Account: 'Wwer',
        Credit: 190.7011432,
        seventhDaysCharge: [578, 250, 902, 963, 282, 293, 130],
        [Symbol.for('option1')]: lCAccountDataAssign([578, 250, 902, 963, 282, 293, 130]),
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934]),
    }, {
        key: 11,
        Account: 'Zfe',
        Credit: 9.294431876,
        seventhDaysCharge: [391, 850, 366, 344, 675, 613, 153],
        [Symbol.for('option1')]: lCAccountDataAssign([391, 850, 366, 344, 675, 613, 153]),
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224]),

    }, {
        key: 12,
        Account: 'Akefe',
        Credit: 239.594652,
        seventhDaysCharge: [700, 337, 46, 567, 225, 377, 412],
        [Symbol.for('option1')]: lCAccountDataAssign([700, 337, 46, 567, 225, 377, 412]),
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256]),

    }, {
        key: 13,
        Account: 'Zeler',
        Credit: 681.8826431,
        seventhDaysCharge: [312, 986, 163, 255, 762, 334, 441],
        [Symbol.for('option1')]: lCAccountDataAssign([312, 986, 163, 255, 762, 334, 441]),
        seventhDaysVolume: [168, 236, 475, 13, 240, 103, 759],
        [Symbol.for('option')]: lCAccountDataAssign([168, 236, 475, 13, 240, 103, 759]),
    }
]


// Cost up 数据
export const costFluctuationData: object = [
    {
        key: 0,
        Destination: "Russia",
        Current: 0.4516,
        Previous: 0.0094,
        percent: "4704%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 1,
        Destination: "Japan",
        Current: 0.2858,
        Previous: 0.0104,
        percent: "2648%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    }, {
        key: 2,
        Destination: "Faroe Island (SPECIAL SVC)",
        Current: 0.3269,
        Previous: 0.0142,
        percent: "2202%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 3,
        Destination: "Ecuador(Quito)",
        Current: 0.3291,
        Previous: 0.0172,
        percent: "1813%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    }, {
        key: 4,
        Destination: "China",
        Current: 0.3415,
        Previous: 0.0238,
        percent: "1335%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    }, {
        key: 5,
        Destination: "Gibraltar-Mobile",
        Current: 0.2094,
        Previous: 0.0156,
        percent: "1242%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])

    }, {
        key: 6,
        Destination: "France(PAID800)",
        Current: 0.2202,
        Previous: 0.0171,
        percent: "1188%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    }, {
        key: 7,
        Destination: "Austria",
        Current: 0.368,
        Previous: 0.0724,
        percent: "408%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    }, {
        key: 8,
        Destination: "Ecuador(PACIFICTEL)",
        Current: 0.3474,
        Previous: 0.0724,
        percent: "380%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    }, {
        key: 9,
        Destination: "Egypt-Cairo",
        Current: 0.3386,
        Previous: 0.0724,
        percent: "368%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    }, {
        key: 10,
        Destination: "Finland(CORPORATE)",
        Current: 0.2241,
        Previous: 0.1067,
        percent: "110%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    }, {
        key: 11,
        Destination: "Finland-Mobile(TDC)",
        Current: 0.3592,
        Previous: 0.2241,
        percent: "60%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])
    }, {
        key: 12,
        Destination: "Ghana-Mobile(KASAPA)",
        Current: 0.2858,
        Previous: 0.2241,
        percent: "28%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])
    }, {
        key: 13,
        Destination: "Ecuador-Mobile",
        Current: 0.2858,
        Previous: 0.2682,
        percent: "7%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }
]

export const costFluctuationDownData: object = [
    {
        key: 0,
        Destination: "Jamaica-Mobile (CWJ)",
        Current: 0.0172,
        Previous: 0.1171,
        percent: "-85%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    },
    {
        key: 1,
        Destination: "Indonesia-Major Cities",
        Current: 0.0626,
        Previous: 0.304,
        percent: "-79%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    },
    {
        key: 2,
        Destination: "Saudi Arabia-Riyadh",
        Current: 0.0172,
        Previous: 0.0724,
        percent: "-76%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])
    },
    {
        key: 3,
        Destination: "Ireland (PERSONAL NUMBER)",
        Current: 0.0128,
        Previous: 0.0238,
        percent: "-46%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    },
    {
        key: 4,
        Destination: "Indonesia-Mob (EXCELCOM)",
        Current: 0.0142,
        Previous: 0.023,
        percent: "-38%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    },
    {
        key: 5,
        Destination: "Kazakhstan-Baikonur",
        Current: 0.0724,
        Previous: 0.1067,
        percent: "-32%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    },
    {
        key: 6,
        Destination: "Poland-Warsaw (TP)",
        Current: 0.0128,
        Previous: 0.0172,
        percent: "-26%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    },
    {
        key: 7,
        Destination: "Kenya-Mobile (ZAIN)",
        Current: 0.0172,
        Previous: 0.0196,
        percent: "-12%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    },
    {
        key: 8,
        Destination: "Kazakhstan-Astana",
        Current: 0.095,
        Previous: 0.0724,
        percent: "31%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])

    },
    {
        key: 9,
        Destination: "Romania (Alternative Network)",
        Current: 0.023,
        Previous: 0.0142,
        percent: "62%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])

    },
    {
        key: 10,
        Destination: "Kirgyzstan-Mobile",
        Current: 0.0165,
        Previous: 0.2241,
        percent: "-93%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    },
    {
        key: 11,
        Destination: "Norfolk Islands",
        Current: 0.0165,
        Previous: 0.2241,
        percent: "-93%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    },
    {
        key: 12,
        Destination: "Sudan-Mobile (NOW)",
        Current: 0.0204,
        Previous: 0.2682,
        percent: "-92%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    },
    {
        key: 13,
        Destination: "Ireland-Mob (TESCO)",
        Current: 0.114,
        Previous: 0.1067,
        percent: "7%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])

    }
]

// Inbound
export const fluctuationDestData: object = [
    {
        key: 0,
        Destination: "Russia",
        "12-Sep": 0.4516,
        "11-Sep": 0.0094,
        percent: "4704%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 1,
        Destination: "Japan",
        "12-Sep": 0.2858,
        "11-Sep": 0.0104,
        percent: "2648%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    }, {
        key: 2,
        Destination: "Faroe Island (SPECIAL SVC)",
        "12-Sep": 0.3269,
        "11-Sep": 0.0142,
        percent: "2202%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 3,
        Destination: "Ecuador (Quito)",
        "12-Sep": 0.3291,
        "11-Sep": 0.0172,
        percent: "1813%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    }, {
        key: 4,
        Destination: "China",
        "12-Sep": 0.3415,
        "11-Sep": 0.0238,
        percent: "1335%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    }, {
        key: 5,
        Destination: "Gibraltar-Mobile",
        "12-Sep": 0.2094,
        "11-Sep": 0.0156,
        percent: "1242%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])
    }, {
        key: 6,
        Destination: "France (PAID 800)",
        "12-Sep": 0.2202,
        "11-Sep": 0.0171,
        percent: "1188%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    }, {
        key: 7,
        Destination: "Austria",
        "12-Sep": 0.368,
        "11-Sep": 0.0724,
        percent: "408%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    }, {
        key: 8,
        Destination: "Ecuador (PACIFICTEL)",
        "12-Sep": 0.3474,
        "11-Sep": 0.0724,
        percent: "380%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    }, {
        key: 9,
        Destination: "Egypt-Cairo",
        "12-Sep": 0.3386,
        "11-Sep": 0.0724,
        percent: "368%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    }, {
        key: 10,
        Destination: "Finland (CORPORATE)",
        "12-Sep": 0.2241,
        "11-Sep": 0.1067,
        percent: "110%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    }, {
        key: 11,
        Destination: "Finland-Mobile (TDC)",
        "12-Sep": 0.3592,
        "11-Sep": 0.2241,
        percent: "60%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])
    }, {
        key: 12,
        Destination: "Ghana-Mobile (KASAPA)",
        "12-Sep": 0.2858,
        "11-Sep": 0.2241,
        percent: "28%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])
    }, {
        key: 13,
        Destination: "Ecuador-Mobile",
        "12-Sep": 0.2858,
        "11-Sep": 0.2682,
        percent: "7%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }
]

// Outbound
export const fluctuationDestOutBoundData: object = [
    {
        key: 0,
        Destination: "Jamaica-Mobile (CWJ)",
        "12-Sep": 0.0172,
        "11-Sep": 0.1171,
        percent: "-85%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    }, {
        key: 1,
        Destination: "Indonesia-Major Cities",
        "12-Sep": 0.0626,
        "11-Sep": 0.304,
        percent: "-79%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    }, {
        key: 2,
        Destination: "Saudi Arabia-Riyadh",
        "12-Sep": 0.0172,
        "11-Sep": 0.0724,
        percent: "-76%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])
    }, {
        key: 3,
        Destination: "Ireland (PERSONAL NUMBER)",
        "12-Sep": 0.0128,
        "11-Sep": 0.0238,
        percent: "-46%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    }, {
        key: 4,
        Destination: "Indonesia-Mob (EXCELCOM)",
        "12-Sep": 0.0142,
        "11-Sep": 0.023,
        percent: "-38%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    }, {
        key: 5,
        Destination: "Kazakhstan-Baikonur",
        "12-Sep": 0.0724,
        "11-Sep": 0.1067,
        percent: "-32%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    }, {
        key: 6,
        Destination: "Poland-Warsaw (TP)",
        "12-Sep": 0.0128,
        "11-Sep": 0.0172,
        percent: "-26%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    }, {
        key: 7,
        Destination: "Kenya-Mobile (ZAIN)",
        "12-Sep": 0.0172,
        "11-Sep": 0.0196,
        percent: "-12%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    }, {
        key: 8,
        Destination: "Kazakhstan-Astana",
        "12-Sep": 0.095,
        "11-Sep": 0.0724,
        percent: "31%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])
    }, {
        key: 9,
        Destination: "Romania (Alternative Network)",
        "12-Sep": 0.023,
        "11-Sep": 0.0142,
        percent: "62%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 10,
        Destination: "Kirgyzstan-Mobile",
        "12-Sep": 0.0165,
        "11-Sep": 0.2241,
        percent: "-93%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 11,
        Destination: "Norfolk Islands",
        "12-Sep": 0.0165,
        "11-Sep": 0.2241,
        percent: "-93%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    }, {
        key: 12,
        Destination: "Sudan-Mobile (NOW)",
        "12-Sep": 0.0204,
        "11-Sep": 0.2682,
        percent: "-92%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 13,
        Destination: "Ireland-Mob (TESCO)",
        "12-Sep": 0.114,
        "11-Sep": 0.1067,
        percent: "7%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])
    }

]


// Inbound
export const fluctuationAccData: object = [
    {
        key: 0,
        Destination: "Afeef",
        "12-Sep": 0.4516,
        "11-Sep": 0.0094,
        percent: "4704%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 1,
        Destination: "Beer",
        "12-Sep": 0.2858,
        "11-Sep": 0.0104,
        percent: "2648%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    }, {
        key: 2,
        Destination: "VEW",
        "12-Sep": 0.3269,
        "11-Sep": 0.0142,
        percent: "2202%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 3,
        Destination: "Cail",
        "12-Sep": 0.3291,
        "11-Sep": 0.0172,
        percent: "1813%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    }, {
        key: 4,
        Destination: "Deqoe",
        "12-Sep": 0.3415,
        "11-Sep": 0.0238,
        percent: "1335%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    }, {
        key: 5,
        Destination: "Fkieir",
        "12-Sep": 0.2094,
        "11-Sep": 0.0156,
        percent: "1242%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])
    }, {
        key: 6,
        Destination: "FEe22",
        "12-Sep": 0.2202,
        "11-Sep": 0.0171,
        percent: "1188%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    }, {
        key: 7,
        Destination: "E#34",
        "12-Sep": 0.368,
        "11-Sep": 0.0724,
        percent: "408%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    }, {
        key: 8,
        Destination: "Ytiife",
        "12-Sep": 0.3474,
        "11-Sep": 0.0724,
        percent: "380%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    }, {
        key: 9,
        Destination: "Feew",
        "12-Sep": 0.3386,
        "11-Sep": 0.0724,
        percent: "368%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    }, {
        key: 10,
        Destination: "Wwer",
        "12-Sep": 0.2241,
        "11-Sep": 0.1067,
        percent: "110%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    }, {
        key: 11,
        Destination: "Zfe",
        "12-Sep": 0.3592,
        "11-Sep": 0.2241,
        percent: "60%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])
    }, {
        key: 12,
        Destination: "Akefe",
        "12-Sep": 0.2858,
        "11-Sep": 0.2241,
        percent: "28%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])
    }, {
        key: 13,
        Destination: "Zeler",
        "12-Sep": 0.2858,
        "11-Sep": 0.2682,
        percent: "7%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }
]

// Outbound
export const fluctuationAccOutBoundData: object = [
    {
        key: 0,
        Destination: "AT&T US",
        "12-Sep": 0.0165,
        "11-Sep": 0.2241,
        percent: "-93%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }, {
        key: 1,
        Destination: "British",
        "12-Sep": 0.0165,
        "11-Sep": 0.2241,
        percent: "-93%",
        seventhDaysVolume: [655, 817, 54, 679, 80, 836, 749],
        [Symbol.for('option')]: lCAccountDataAssign([655, 817, 54, 679, 80, 836, 749])
    }, {
        key: 2,
        Destination: "Duetch",
        "12-Sep": 0.0204,
        "11-Sep": 0.2682,
        percent: "-92%",
        seventhDaysVolume: [216, 734, 375, 625, 624, 387, 545],
        [Symbol.for('option')]: lCAccountDataAssign([216, 734, 375, 625, 624, 387, 545])
    }, {
        key: 3,
        Destination: "Vodafon",
        "12-Sep": 0.0172,
        "11-Sep": 0.1171,
        percent: "-85%",
        seventhDaysVolume: [793, 764, 887, 113, 873, 763, 87],
        [Symbol.for('option')]: lCAccountDataAssign([793, 764, 887, 113, 873, 763, 87])
    }, {
        key: 4,
        Destination: "Russian",
        "12-Sep": 0.0626,
        "11-Sep": 0.304,
        percent: "-79%",
        seventhDaysVolume: [478, 927, 518, 30, 513, 628, 775],
        [Symbol.for('option')]: lCAccountDataAssign([478, 927, 518, 30, 513, 628, 775])
    }, {
        key: 5,
        Destination: "Sigtel-",
        "12-Sep": 0.0172,
        "11-Sep": 0.0724,
        percent: "-76%",
        seventhDaysVolume: [414, 362, 400, 48, 765, 819, 857],
        [Symbol.for('option')]: lCAccountDataAssign([414, 362, 400, 48, 765, 819, 857])
    }, {
        key: 6,
        Destination: "Airtel",
        "12-Sep": 0.0128,
        "11-Sep": 0.0238,
        percent: "-46%",
        seventhDaysVolume: [61, 396, 656, 28, 750, 995, 275],
        [Symbol.for('option')]: lCAccountDataAssign([61, 396, 656, 28, 750, 995, 275])
    }, {
        key: 7,
        Destination: "CnUnico",
        "12-Sep": 0.0142,
        "11-Sep": 0.023,
        percent: "-38%",
        seventhDaysVolume: [812, 441, 940, 295, 612, 636, 451],
        [Symbol.for('option')]: lCAccountDataAssign([812, 441, 940, 295, 612, 636, 451])
    }, {
        key: 8,
        Destination: "Metfone",
        "12-Sep": 0.0724,
        "11-Sep": 0.1067,
        percent: "-32%",
        seventhDaysVolume: [361, 552, 471, 940, 680, 24, 565],
        [Symbol.for('option')]: lCAccountDataAssign([361, 552, 471, 940, 680, 24, 565])
    }, {
        key: 9,
        Destination: "Telenor",
        "12-Sep": 0.0128,
        "11-Sep": 0.0172,
        percent: "-26%",
        seventhDaysVolume: [247, 100, 262, 143, 212, 469, 675],
        [Symbol.for('option')]: lCAccountDataAssign([247, 100, 262, 143, 212, 469, 675])
    }, {
        key: 10,
        Destination: "Smarton",
        "12-Sep": 0.0172,
        "11-Sep": 0.0196,
        percent: "-12%",
        seventhDaysVolume: [954, 353, 405, 765, 736, 523, 2],
        [Symbol.for('option')]: lCAccountDataAssign([954, 353, 405, 765, 736, 523, 2])
    }, {
        key: 11,
        Destination: "LG Kor-",
        "12-Sep": 0.114,
        "11-Sep": 0.1067,
        percent: "7%",
        seventhDaysVolume: [821, 312, 603, 832, 45, 949, 934],
        [Symbol.for('option')]: lCAccountDataAssign([821, 312, 603, 832, 45, 949, 934])
    }, {
        key: 12,
        Destination: "Verizon",
        "12-Sep": 0.095,
        "11-Sep": 0.0724,
        percent: "31%",
        seventhDaysVolume: [737, 528, 598, 338, 311, 487, 224],
        [Symbol.for('option')]: lCAccountDataAssign([737, 528, 598, 338, 311, 487, 224])
    }, {
        key: 13,
        Destination: "Citic-I",
        "12-Sep": 0.023,
        "11-Sep": 0.0142,
        percent: "62%",
        seventhDaysVolume: [728, 798, 961, 278, 88, 270, 256],
        [Symbol.for('option')]: lCAccountDataAssign([728, 798, 961, 278, 88, 270, 256])
    }

]

//  Agreement with volume deviation 的完成率
export const AgreementWVDCompletionRate: Array<Object> = [34.9042, 48.3351, 75.3572, 31.2023, 59.6273, 61.5185, 5.2296, 13.6413, 81.6948, 67.2612, 50.2810, 46.4472, 81.6601, 36.6827]

//  Agreement with volume deviation 的"一般" 标准线
export const AgreementWVDCommonRate: Array<Object> = [43.9042, 53.3351, 85.3571, 38.2023, 65.6273, 65.5185, 13.2296, 17.6413, 86.6948, 77.2612, 56.2810, 50.4472, 85.6601, 46.6827]

//  Agreement with volume deviation 的"良好" 标准线
export const AgreementWVDGoodRate: Array<Object> = [
    53.9042 - 43.9042,
    63.3351 - 53.3351,
    95.3571 - 85.3571,
    48.2023 - 38.2023,
    75.6273 - 65.6273,

    75.5185 - 65.5185,
    23.2296 - 13.2296,
    27.6413 - 17.6413,
    96.6948 - 86.6948,
    87.2612 - 77.2612,
    66.2810 - 56.2810,
    60.4472 - 50.4472,
    95.6601 - 85.6601,
    56.6827 - 46.6827
]

//  Agreement with volume deviation 的"优秀" 标准线
export const AgreementWVDVeryGoodRate: Array<Object> = [
    100 - 53.9042,
    100 - 63.3351,
    100 - 95.3571,
    100 - 48.2023,
    100 - 75.6273,

    100 - 75.5185,
    100 - 23.2296,
    100 - 27.6413,
    100 - 96.6948,
    100 - 87.2612,
    100 - 66.2810,
    100 - 60.4472,
    100 - 95.6601,
    100 - 56.6827,
]
