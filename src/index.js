
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import sprint_seoul from './raw/sprint_seoul.png'
import devops_kr from './raw/devops_kr.png'
import './index.css';
import { PageHeader, Card, Col, Row, Layout, Input, Menu, Tag, Divider } from 'antd';
const { Header, Content, Sider, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const { SubMenu } = Menu;

const onSearch = value => console.log(value);

ReactDOM.render(

<Layout>
  <Header style={{ background: '#FFF'}} > 
    LOGO
  </Header>


  <Content>
  <div style={{ background: '#ECECEC', padding: '3%', align: 'center' }}>
    {/* <Row gutter= {12} >
      <PageHeader title="10월 행사"> </PageHeader>
    </Row>
     */}
    
    <h1> 10월 행사 </h1>
    <Search placeholder="Search..." onSearch={onSearch} style={{ width: 200 }} />

    <br />
    <Tag color="volcano"> 컨퍼런스 </Tag>     
    <Tag color="blue"> 교육 </Tag> 
    <Tag color="orange"> 인공지능 </Tag> 
    <Tag color="lime"> 해커톤 </Tag>

  </div>

   


  <div style={{ background: '#ECECEC', padding: '3%', align: 'center' }}>
    <Row gutter= {12} >
    <h1>개발자 모임</h1>
    </Row>
    <Row gutter={12}>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
      <Col span={4}>
        <Card title="" 
              cover={<img alt="example" src={sprint_seoul}  />}
              bordered={false} hoverable>
          <Meta title="스프린트 서울" description="description" />
        </Card>
      </Col>
    </Row>
  </div>
  </Content>


  <Footer style={{ textAlign: 'center' }}>
    Dev Event ©2020 Created by Covenant
  </Footer>

  </Layout>,
  document.getElementById('container'),
);
