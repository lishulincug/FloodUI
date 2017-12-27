import React from 'react';
import { Form, DatePicker, Button, Select } from 'antd';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;


class QueryFormComponent extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <div>
        <h1>查询条件</h1>
        <br />
        <hr />
        <Form>
          <FormItem label={'空间查询'}>
            <Button type={'primary'} size={'small'}>选择空间范围</Button>
          </FormItem>
          <FormItem
            label={'时间查询'}
          >
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
        )}
          </FormItem>
          <FormItem label={'空间查询'}>
            <Select style={{ width: 200 }}>
              <Option value="flood">洪涝灾害</Option>
              <Option value="road">路域灾害</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type={'primary'} size={'small'}>查询</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export const DisasterQueryForm = Form.create()(QueryFormComponent);
