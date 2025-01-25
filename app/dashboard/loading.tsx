import React from 'react';
import { Card, Row, Col, Skeleton } from 'antd';

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton.Input style={{ width: 200 }} active />
          <Skeleton.Button active />
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>

          <Col xs={24}>
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
