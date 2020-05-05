<template>
<div v-if="fixedCharge === 'Yes'">
  <div class="Ratingzone">
    <h1>Rating zone</h1>
    <a-form :form="zoneForm">
      <div class="Zone-code" v-for="(item,key) in ratingData" :key="key">
        <span class="title">Zone {{item.Zone}}</span>
        <table class="gridtable border">
          <thead>
            <tr v-for="(title,num) in ratingCloum" :key="num">
              <th>
                {{title.ChargeItem.title}}
              </th>
              <th> <span style="color:red">*</span>{{title.Amount.title}}</th>
              <th> {{title.beginDate.title}}</th>
              <th> {{title.endDate.title}}</th>
            </tr>
          </thead>
          <tbody>
            <td> <a-form-item>
               <a-input @change="onInput" :disabled="item.ChargeItem.disabled" placeholder="" v-decorator="[
                                `${item.ChargeItem.name}`,
                                {
                                rules: [{
                                    required:  item.ChargeItem.required,
                                    message: `${item.ChargeItem.name} field should be no-null`
                                }],
                                initialValue: item.ChargeItem.initialValue
                                }
                            ]" />
              </a-form-item></td>
            <td>
              <a-form-item>
                <a-input @change="onInput" :disabled="item.ChargeItem.disabled" placeholder="" v-decorator="[
                                `${item.Amount.name}`,
                                {
                                rules: [{
                                    required:  item.Amount.required,
                                    message: `${item.Amount.name} field should be no-null`
                                }],
                                initialValue: item.Amount.initialValue
                                }
                            ]" />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-date-picker :disabled="item.beginDate.disabled" @change="pickeChange($event,item.beginDate.name)" style="width:100%;" placeholder="" v-decorator="[
                                `${item.beginDate.name}`,
                                {
                                rules: [{
                                    required:  item.beginDate.required,
                                    message: `${item.beginDate.name} field should be no-null`
                                }],
                                initialValue:  item.endDate.initialValue && moment(item.beginDate.initialValue, 'YYYY-MM-DD') || undefined
                                }
                            ]" />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-date-picker :disabled="item.endDate.disabled" @change="pickeChange($event,item.endDate.name)" style="width:100%;" placeholder="" v-decorator="[
                                `${item.endDate.name}`,
                                {
                                rules: [{
                                    required:  item.endDate.required,
                                    message: `${item.endDate.name} field should be no-null`
                                }],
                                initialValue:  item.endDate.initialValue && moment(item.endDate.initialValue, 'YYYY-MM-DD') || undefined
                                }
                            ]" />
              </a-form-item>
            </td>
          </tbody>
        </table>
      </div>
    </a-form>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Emit
} from 'vue-property-decorator'

@Component
export default class ratingZoneForm extends Vue {
  @Prop(Array) private ratingData: any
  @Prop(String) private fixedCharge: any
  @Emit('input') inputChange(value:string|number,name:string){}
  @Emit('picker') pickeChange (val:any,name:string){}
  @Emit('ratingForm') ratingForm(form:any) {}
  private ratingCloum: any[] = [{
    ChargeItem: {
      title: 'Charge-Item',
      required: false
    },
    Amount: {
      title: 'Amount',
      required: false
    },
    beginDate: {
      title: 'Begin date',
      required: true
    },
    endDate: {
      title: 'End date',
      required: true
    }
  }]
  /* zoneForm */
  private zoneForm: any;
  public beforeCreate() {
    this.zoneForm = this.$form.createForm(this);
  }
    public onInput (e:any) {
    this.inputChange(e.target.value,e.target.id)
  }
  public onpicke (val:any,name:string) {
    this.pickeChange(val,name)
  }
  public created() {
    this.ratingForm(this.zoneForm)
  }
}
</script>

<style lang="scss" scoped>
.Ratingzone {
  h1 {
    padding: 10px;
    border-bottom: 1px solid rgb(231, 231, 231);
  }
}

.Zone-code {

  margin: 10px;

  .title {
    padding: 10px;
    font-weight: 600;
    color: #000;
    background-color: rgb(220, 223, 241);
    display: block;
    padding-left: 20px;
  }
}

.gridtable {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  width: 100%;
  text-align: center;
  overflow-y: scroll;
}

table.border tr th,
table.border tr td {
  border: 1px solid #e6e6e6;
}

table.gridtable th {
  background-color: rgb(233, 235, 244);
  transition: background 0.3s ease;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  padding: 8px;
}

table.gridtable td {
  padding: 0px 8px;
  border: 1px solid #e6e6e6;

  .ant-form-item {
    margin: 0;
  }
}

</style>
