import api from './api';
import type { OtpResponse } from '../types';

export const verifyOTP = async (email: string, code: string): Promise<OtpResponse> => {
  //verificationCode
  const response = await api.post<OtpResponse>('/auth/verify-otp', { 
    email, 
    code 
  });
  return response.data;
};

export const resendOTP = async (email: string): Promise<{ message: string }> => {
  return (await api.post('/auth/resend-otp', { email })).data;
};