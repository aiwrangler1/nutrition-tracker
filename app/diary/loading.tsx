import React from 'react';
import { Card, Skeleton } from 'antd';

export default function DiaryLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Skeleton.Input style={{ width: 200 }} active />
            <Skeleton.Input style={{ width: 120 }} active />
          </div>
          <Skeleton.Button active />
        </div>

        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    </div>
  );
}
