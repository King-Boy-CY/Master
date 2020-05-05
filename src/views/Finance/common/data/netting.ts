import {
  CycleOptions,
  ChargeTypeOptions,
  DirectionOptions,
} from '@/views/Finance/common/data/index.ts'
import {
  nagativePointNumberReg,
  numberPointReg,
  numberReg,
  nagativeNoLimitPointNumberReg
} from "@/common/RegExp/number";
// 弹出框 modal  内容
// basic data
export const baseInfoFormOptions: any = () => {
  return [
    {
      Tips: 'Service',
      decorator: 'Service',
      required: true,
      type: 'select',
      options: null
    }, {
      Tips: 'Account',
      decorator: 'Account',
      required: true,
      type: 'select',
      options: null
    }, {
      Tips: 'Charge type',
      decorator: 'ChargeType',
      required: true,
      type: 'select',
      options: ChargeTypeOptions,
    }, {
      Tips: 'Direction',
      decorator: 'Direction',
      required: true,
      type: 'select',
      options: DirectionOptions,
    }, {
      Tips: 'Cycle',
      decorator: 'Cycle',
      required: true,
      type: 'select',
      options: CycleOptions,
    }, {
      Tips: 'Month',
      decorator: 'Month',
      required: true,
      type: 'picker-month',
    }, {
      Tips: 'Begin date',
      decorator: 'BeginDate',
      required: true,
      type: 'picker',
      disabled: true
    }, {
      Tips: 'End date',
      decorator: 'EndDate',
      required: true,
      type: 'picker',
      disabled: true
    }
  ]
}

//  inbound data
export const inboundFormOptions: any = () => {
  return [
    {
      Tips: 'Amount',
      decorator: 'Inbound_Amount',
      required: true,
      disabled:false,
      placeholderName: '0',
      type: 'input',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(
            nagativeNoLimitPointNumberReg,
            "g"
          );
          if (!pattern.test(value)) {
            callback("Amount can only be a number");
          } else {
            callback();
          }
        }
      }]
    }, {
      Tips: 'Currency',
      decorator: 'Inbound_Currency',
      required: true,
      type: 'select',
      initialValue: undefined,
      options: null
    }, {
      Tips: 'Calls',
      decorator: 'Inbound_Calls',
      required: false,
      disabled:false,
      type: 'input',
      placeholderName: '0',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(numberReg, "g");
          if (!pattern.test(value)) {
            callback("Calls can only be a number");
          } else {
            callback();
          }
        }
      }]
    }, {
      Tips: 'Mins',
      decorator: 'Inbound_Mins',
      required: false,
      disabled:false,
      placeholderName: '0',
      type: 'input',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(numberReg, "g");
          if (!pattern.test(value)) {
            callback("Mins can only be a number");
          } else {
            callback();
          }
        }
      }]
    }]
}

// outbound data
export const outboundFormOptions: any = () => {
  return [
    {
      Tips: 'Amount',
      decorator: 'Outbound_Amount',
      required: true,
      type: 'input',
      disabled:false,
      placeholderName: '0',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(
            nagativeNoLimitPointNumberReg,
            "g"
          );
          if (!pattern.test(value)) {
            callback("Amount can only be a number");
          } else {
            callback();
          }
        }
      }]
    }, {
      Tips: 'Currency',
      decorator: 'Outbound_Currency',
      required: true,
      type: 'select',
      initialValue: undefined,
      disabled:false,
      options: null
    }, {
      Tips: 'Calls',
      decorator: 'Outbound_Calls',
      required: false,
      disabled:false,
      placeholderName: '0',
      type: 'input',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(numberReg, "g");
          if (!pattern.test(value)) {
            callback("Calls can only be a number");
          } else {
            callback();
          }
        }
      }]
    }, {
      Tips: 'Mins',
      decorator: 'Outbound_Mins',
      required: false,
      disabled:false,
      placeholderName: 0,
      type: 'input',
      rules: [{
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          }
          const pattern: RegExp = new RegExp(numberReg, "g");
          if (!pattern.test(value)) {
            callback("Mins can only be a number");
          } else {
            callback();
          }
        }
      }]
    }
  ]
}

// netting data
export const nettingdFormOptions: any = () => {
  return [
    {
      Tips: 'Amount(USD)',
      decorator: 'Amount_USD',
      required: true,
      type: 'input',
      disabled: true
    }, {
      Tips: 'Exchange date',
      decorator: 'ExchangeDate',
      placeholderName:'Default',
      required: false,
      disabled:false,
      type: 'picker-month',
    }]
}


// inbound Inbound_Currency Inbound_Amount
export const nettingObj: any = () => {
  return {
    inbound: undefined,
    outbound: undefined,
    netting: {
      Amount_USD: undefined,
      ExchangeDate: undefined
    },
  }
}
