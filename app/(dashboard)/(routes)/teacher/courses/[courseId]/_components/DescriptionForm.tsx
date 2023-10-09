'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';

const formSchema = z.object({
  description: z.string().min(1, {
    message: 'Description is required.',
  }),
});

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({
  initialData,
  courseId,
}) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course Updated');
      toggleEdit();
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course description
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit description
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic'
          )}
        >
          {initialData.description || 'No description'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button
                type='submit'
                size='sm'
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DescriptionForm;
