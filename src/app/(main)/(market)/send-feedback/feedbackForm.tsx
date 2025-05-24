'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { db, storage } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, StorageReference } from 'firebase/storage';
import Image from 'next/image';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type Screenshot = {
  id: number;
  image: string;
};
const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  description: z.string().min(1, { message: 'Issue description is required.' }),
  screenshot: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 6 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    )
    .optional(),
});

export function FeedbackForm({
  country,
  city,
  region,
  ip,
}: {
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const user_id = userStore((state) => state.user_id);
  const user_loaded = userStore((state) => state.user_loaded);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();
  const [screenshot, setScreenshot] = React.useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      description: '',
      screenshot: undefined,
    },
  });

  async function uploadImage(docId: string) {
    let ss = screenshot;
    const uploadFiles = form.getValues('screenshot');

    if (ss !== '' && uploadFiles !== undefined) {
      const ss_fileName = docId + uploadFiles[0].name;
      const screenshotStorageRef: StorageReference = ref(
        storage,
        `feedback/${docId}/${ss_fileName}`
      );

      await uploadFile(screenshotStorageRef, uploadFiles[0], {
        contentType: uploadFiles[0].type,
      });
      ss = await getDownloadURL(screenshotStorageRef);
    }
    return ss;
  }
  async function clearScreenshot() {
    setScreenshot('');
    form.resetField('screenshot');
  }
  async function onSubmit() {
    setDisabled(true);
    try {
      const feedbackRef: CollectionReference = collection(db, `feedback`);
      const feedbackDoc: DocumentReference = doc(feedbackRef);
      let screenshotUrl = '';
      if (screenshot !== '') {
        screenshotUrl = await uploadImage(feedbackDoc.id);
      }
      await setDoc(feedbackDoc, {
        description: form.getValues('description'),
        email: form.getValues('email'),
        screenshot_url: screenshotUrl,
        country: country,
        city: city,
        region: region,
        ip: ip,
        created_at: Timestamp.fromDate(new Date()),
      });
      await fetch('/api/new_feedback_email', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user_id,
          email: form.getValues('email'),
          description: form.getValues('description'),
          file: screenshotUrl,
          country: country,
          city: city,
          region: region,
          ip: ip,
          created_at: format(new Date(), 'LLL dd, yyyy'),
        }),
      });
      toast.success('Feedback Submitted', {
        description: 'Your feedback has been successfully submitted.',
      });
      form.reset();
      setScreenshot('');
    } catch (error) {
      console.error(error);
      toast.error('Error Submitting', {
        description:
          'There was an error submitting your feedback. Please try again.',
      });
    } finally {
      setDisabled(false);
    }
  }

  if (user_loaded === false) {
    return;
  }
  return (
    <section className="flex h-full min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-[600px] space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        onChangeCapture={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        onChangeCapture={field.onChange}
                        placeholder="Tell us a little bit about this collection..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="screenshot"
                render={({ field: { onChange }, ...field }) => {
                  const images = form.watch('screenshot');

                  return (
                    <FormItem>
                      <FormControl>
                        {screenshot === '' ? (
                          <Input
                            type="file"
                            {...field}
                            onChange={(event) => {
                              const dataTransfer = new DataTransfer();

                              // Add old images
                              if (images) {
                                Array.from(images).forEach((image) =>
                                  dataTransfer.items.add(image)
                                );
                              }

                              // Add newly uploaded images
                              Array.from(event.target.files!).forEach((image) =>
                                dataTransfer.items.add(image)
                              );

                              // Validate and update uploaded file
                              const newFiles = dataTransfer.files;
                              const [file] = newFiles;
                              if (file) {
                                setScreenshot(URL.createObjectURL(file));
                              }
                              onChange(newFiles);
                            }}
                          />
                        ) : (
                          <section className="flex w-full items-center gap-8">
                            <section className="flex flex-1">
                              <Image
                                src={screenshot}
                                alt="Feedback Screenshot"
                                width={3096}
                                height={526}
                                style={{ width: '100%', height: 'auto' }}
                              />
                            </section>
                            <section>
                              <Button
                                asChild
                                variant="destructive"
                                onClick={clearScreenshot}
                              >
                                <p>
                                  <FontAwesomeIcon
                                    className="icon"
                                    icon={faTrash}
                                  />
                                </p>
                              </Button>
                            </section>
                          </section>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardFooter>
          {disabled ? (
            <Button variant="outline">
              <FontAwesomeIcon
                className="icon mr-2 h-4 w-4"
                icon={faSpinner}
                spin
              />
              Submitting
            </Button>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
