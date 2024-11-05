'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TagsInput } from '@/components/ui/tags-input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db, storage } from '@/lib/firebase';
import {
  faCaretLeft,
  faRefresh,
  faSave,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const formSchema = z.object({
  name: z.string().min(1, { message: 'Post Title is required' }),
  banner: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 files are allowed.`)
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
    .optional(),
  body: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).nonempty('Please at least one item'),
});
type Props = {
  id: string;
  name: string;
  body: string;
  summary: string;
  banner_url: string;
  tags: string[];
  status: string;
};

export default function EditPostForm(props: Props) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const bannerFileRef = React.useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = React.useState<string>('');
  const [bannerFileRemoval, setBannerFileRemoval] = React.useState<string>('');
  const [uploadFile] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name,
      body: props.body,
      summary: props.summary,
      tags: props.tags,
    },
  });

  async function uploadImages(postID: string) {
    let banner = bannerFile;
    if (banner !== '' && !banner.includes('firebasestorage.googleapis.com')) {
      const banner_fileName = 'banner_' + form.getValues('banner')![0].name;
      const storageRef = ref(
        storage,
        `marketing/blog/${postID}/${banner_fileName}`
      );
      await uploadFile(storageRef, form.getValues('banner')![0], {
        contentType: form.getValues('banner')![0].type,
      });

      banner = await getDownloadURL(storageRef);
    }
    if (bannerFileRemoval !== '') {
      let removalURL = bannerFileRemoval.replace(
        'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o',
        ''
      );
      removalURL = removalURL.replace(/\?alt.*/, '');
      removalURL = removalURL.replaceAll('%2F', '/');
      const del_banner_storageRef = ref(storage, removalURL);
      await deleteObject(del_banner_storageRef);
    }
    setBannerFileRemoval('');
    return banner;
  }
  async function onSubmit() {
    try {
      setDisabled(true);
      const docRef: DocumentReference = doc(db, 'blog', props.id);
      const postDoc = await getDoc(docRef);
      if (postDoc.exists()) {
        const banner = await uploadImages(props.id);
        await updateDoc(docRef, {
          name: form.getValues('name'),
          body: form.getValues('body'),
          banner_url: banner,
          tags: form.getValues('tags'),
          summary: form.getValues('summary'),
          updated_at: Timestamp.fromDate(new Date()),
        });
        toast.success('Post Updated', {
          description: 'The blog posting has been updated.',
        });
        revalidate(props.id);
      } else {
        const banner = await uploadImages(props.id);
        await setDoc(docRef, {
          name: form.getValues('name'),
          body: form.getValues('body'),
          summary: form.getValues('summary'),
          banner_url: banner,
          tags: form.getValues('tags'),
          status: 'Private',
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
        });
        toast.success('Post Created', {
          description: 'The blog posting has been created.',
        });
        revalidate(props.id);
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    } finally {
      setDisabled(false);
    }
  }
  async function clearBannerFile() {
    if (bannerFile.includes('firebasestorage.googleapis.com')) {
      setBannerFileRemoval(bannerFile);
    }
    setBannerFile('');
    const data = new DataTransfer();
    form.setValue('banner', data.files);
    bannerFileRef.current?.click();
  }

  React.useEffect(() => {
    setBannerFile(props.banner_url);
  }, [props.banner_url]);

  return (
    <section className="relative">
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 p-4">
          <section className="flex w-auto items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/blog">
                    <FontAwesomeIcon className="icon" icon={faCaretLeft} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Posts</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="line-clamp-1">{props.name}</h1>
          </section>
          <div className="flex w-auto items-center gap-4">
            {!disabled && (
              <Button
                type="submit"
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
                asChild
              >
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
          </div>
        </section>
      </section>
      <Separator />
      <section className="relative mx-auto w-full max-w-[1754px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-8 px-4 py-8"
          >
            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Title and meta description</b>
                </p>
                <p>
                  The title and meta description help define how your store
                  shows up on search engines.
                </p>
              </aside>
              <Card className="w-full flex-1">
                <CardContent className="flex w-full flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          For information about Markdown notation.{' '}
                          <Link
                            href="https://www.markdownguide.org/basic-syntax/"
                            target="_blank"
                            className="text-primary"
                          >
                            Go Here
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Use this to summarize what will be in the post for
                          Meta Descriptions and preview of post.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Tags</FormLabel>
                        <FormControl>
                          <TagsInput
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Use{' '}
                          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            Enter
                          </kbd>{' '}
                          to add tags to list.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Post Banner</b>
                </p>
                <p className="pb-4">
                  This image will be used as the main banner for the blog post.
                </p>
                {bannerFile === '' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setFocus('banner');
                      bannerFileRef.current?.click();
                    }}
                    asChild
                  >
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faSquarePlus}
                      />
                      Add File
                    </div>
                  </Button>
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('banner');

                    return (
                      <FormItem>
                        <FormControl>
                          {bannerFile === '' ? (
                            <Input
                              type="file"
                              hidden={true}
                              className="hidden"
                              ref={bannerFileRef}
                              {...field}
                              onChange={(event) => {
                                // Triggered when user uploaded a new file
                                // FileList is immutable, so we need to create a new one
                                const dataTransfer = new DataTransfer();

                                // Add old images
                                if (images) {
                                  Array.from(images).forEach((image) =>
                                    dataTransfer.items.add(image)
                                  );
                                }

                                // Add newly uploaded images
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;

                                const [file] = newFiles;
                                if (file) {
                                  setBannerFile(URL.createObjectURL(file));
                                }
                                onChange(newFiles);
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
              <Card className="w-full flex-1">
                <CardContent className="flex w-full flex-col gap-8">
                  {bannerFile === '' ? (
                    <section className="flex flex-col">
                      <p>
                        <b>No File Yet</b>
                      </p>
                      <p className="text-sm">
                        Add a file to send to your customers.
                      </p>
                    </section>
                  ) : (
                    <section className="flex items-center gap-8">
                      <section className="flex flex-col items-center justify-center">
                        <Image
                          src={bannerFile}
                          alt="Post Banner"
                          width={3096}
                          height={526}
                          style={{ width: '100%', height: 'auto' }}
                        ></Image>
                      </section>
                      <Button
                        asChild
                        variant="destructive"
                        onClick={clearBannerFile}
                      >
                        <p>
                          <FontAwesomeIcon
                            className="icon text-xs"
                            icon={faRefresh}
                          />
                        </p>
                      </Button>
                    </section>
                  )}
                </CardContent>
              </Card>
            </section>
          </form>
        </Form>
      </section>
    </section>
  );
}
