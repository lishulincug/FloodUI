import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var user = {};
        user.userID = values.userName;
        user.passWord = values.password;
        fetch('http://www.myflood.com/login', {
          method: 'POST',
          credentials: 'include',
          headers:
            {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
          body:JSON.stringify(user),
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json();
            } else {
              const error = new Error(response.statusText);
              error.response = response;
              throw error;
            }
          },
        ).then((data) => {
          if (data.flag) {
            //当前是否登录
            const path = {
              pathname: '/',
            };
            this.context.router.history.push(path);
          }else {
            const path = {
              pathname: '/error',
              query: data.message,
            };
            this.context.router.history.push(path);
          }
        }).catch((error) => {
          alert(error.toString());
        });

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住密码</Checkbox>,
          )}
          <a className="login-form-forgot" href="">忘记密码？</a>
          <br />
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
           登录
          </Button>
          <br />
          Or <a href="">现在注册！</a>
        </FormItem>
      </Form>
    );
  }
}
export const LoginComponet = Form.create()(NormalLoginForm);
