import React from 'react';
import { Card, Skeleton } from 'antd';

export default function SettingsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Skeleton.Input style={{ width: 200 }} className="mb-6" active />

        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>

        <Card className="mt-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    </div>
  );
}
