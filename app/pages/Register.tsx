import { Button } from '@app/components/ui/button';
import { DatePicker } from '@app/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { useAuth } from '@app/provider/authProvider';
import routeNames from '@app/routes/route-names';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const apiUrl = import.meta.env.VITE_API_URL;

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const formSchema = z
    .object({
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol'),
      confirmPassword: z.string(),
      dateOfBirth: z.date({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Date of birth must be a valid date',
      }),
      phoneNumber: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Please enter a valid phone number'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dateOfBirth: undefined,
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    console.log(JSON.stringify(formData));
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl + '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error || 'Register failed');
      }

      const data = await res.json();
      setToken(data.access_token);

      navigate(routeNames.dashboard());
    } catch (error) {
      throw new Error('An error occurred during register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="-mt-8 flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="border-primary/50 border-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    className="border-primary/50 border-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="border-primary/50 border-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="bg-secondary border-primary/50 w-52 border-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <span>
              Already have an account?
              <Link to={routeNames.login()} className="pl-2 text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </span>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Register'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
