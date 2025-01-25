'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';

const { Title } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await resetPassword(values.email);
      if (result.error) {
        setError(result.error.message || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>Reset Password</Title>
          <p className="text-gray-600">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            message="Check your email"
            description="We've sent you instructions to reset your password."
            type="success"
            showIcon
            className="mb-6"
          />
        )}

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              disabled={success}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full"
              disabled={success}
            >
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Return to Login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
} 