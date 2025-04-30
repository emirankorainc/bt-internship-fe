import { useAuth } from '@app/provider/authProvider';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@app/assets/logo/bloomteq_logo.png';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import routeNames from '@app/routes/route-names';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error || 'Login failed');
      }

      const data = await res.json();
      setToken(data.access_token);

      navigate(routeNames.dashboard());
    } catch (error) {
      throw new Error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="-mt-12 flex h-screen flex-col items-center justify-center bg-gray-100">
      <img src={logo} alt="Bloomteq logo" className="invert" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="border-primary/50 border-1" {...field} />
                </FormControl>
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
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            <span>
              Do you have an account?
              <Link to={routeNames.register()} className="pl-2 text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </span>
            <Button type="submit">{isLoading ? 'Loading...' : 'Login'}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
