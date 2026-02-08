
import React from 'react';
import { z } from 'zod';

export interface DocumentDefinition<T = any> {
  id: string;
  label: string;
  description: string;
  schema: z.ZodType<T>;
  Component: React.ComponentType<{ data: T }>;
  filename: string;
}
