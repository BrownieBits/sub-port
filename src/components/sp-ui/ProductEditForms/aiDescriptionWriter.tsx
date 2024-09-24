'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getAnswer } from './actions';

const formSchema = z.object({
  prompt: z
    .string()
    .min(6, { message: 'Prompt must be 6 or more characters long' })
    .max(256, {
      message: 'Prompt must be no more than 256 characters long',
    }),
});
export const AiDescriptionWriter = (props: {}) => {
  const [open, setOpen] = React.useState(false);
  const [thinking, setThinking] = React.useState(false);
  const [generation, setGeneration] = React.useState<string>('');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  async function onSubmit() {
    setThinking(true);
    setGeneration('');
    const { text } = await getAnswer(aiForm.getValues('prompt'));
    setThinking(false);
    setGeneration(text);
  }

  const aiForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="h-auto p-[0] px-4 text-foreground hover:no-underline"
            asChild
          >
            <span>Click Here</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <h3>Ai Generation</h3>
            </DialogTitle>
            <DialogDescription className="flex flex-col">
              <Form {...aiForm}>
                <form
                  onSubmit={aiForm.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-8 py-8"
                >
                  <FormField
                    control={aiForm.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="w-full text-foreground">
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            onChangeCapture={field.onChange}
                            placeholder="Tell us a little bit about this product..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              {thinking ? (
                <Button variant="outline">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faSpinner}
                    spin
                  />
                  Thinking
                </Button>
              ) : (
                <Button type="submit" onClick={aiForm.handleSubmit(onSubmit)}>
                  Get suggestions
                </Button>
              )}

              <p
                className={cn('whitespace-pre-wrap pt-4 text-foreground', {
                  hidden: generation === '',
                })}
              >
                {generation.replaceAll(' **', '\n**')}
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button
          variant="link"
          className="h-auto p-[0] px-4 text-foreground hover:no-underline"
          asChild
        >
          <span>Click Here</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex justify-between">
            <h3>Ai Generation</h3>
            <DrawerClose>
              <Button variant="outline">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription className="flex w-full flex-col items-start text-left">
            <Form {...aiForm}>
              <form
                onSubmit={aiForm.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-8 py-8"
              >
                <FormField
                  control={aiForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full text-foreground">
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          onChangeCapture={field.onChange}
                          placeholder="Tell us a little bit about this product..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {thinking ? (
              <Button variant="outline">
                <FontAwesomeIcon
                  className="icon mr-2 h-4 w-4"
                  icon={faSpinner}
                  spin
                />
                Thinking
              </Button>
            ) : (
              <Button type="submit" onClick={aiForm.handleSubmit(onSubmit)}>
                Get suggestions
              </Button>
            )}

            <p
              className={cn('whitespace-pre-wrap pt-4 text-foreground', {
                hidden: generation === '',
              })}
            >
              {generation.replaceAll(' **', '\n**')}
            </p>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
