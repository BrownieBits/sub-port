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
import { useMediaQuery } from '@/hooks/use-media-query';
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
export const AiDescriptionWriter = () => {
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
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
            className="text-foreground h-auto p-[0] px-4 hover:no-underline"
          >
            Click Here
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ai Generation</DialogTitle>
            <DialogDescription className="flex flex-col" asChild>
              <section>
                <Form {...aiForm}>
                  <form
                    onSubmit={aiForm.handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-8 py-8"
                  >
                    <FormField
                      control={aiForm.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem className="text-foreground w-full">
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
                  className={cn('text-foreground pt-4 whitespace-pre-wrap', {
                    hidden: generation === '',
                  })}
                >
                  {generation.replaceAll(' **', '\n**')}
                </p>
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={(event) => event.preventDefault()}
          className="text-foreground h-auto p-[0] px-4 hover:no-underline"
        >
          Click Here
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex items-center justify-between">
            Ai Generation
            <DrawerClose>
              <Button variant="outline" size="sm">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription
            className="flex w-full flex-col items-start text-left"
            asChild
          >
            <section>
              <Form {...aiForm}>
                <form
                  onSubmit={aiForm.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-8 py-8"
                >
                  <FormField
                    control={aiForm.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="text-foreground w-full">
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
                className={cn('text-foreground pt-4 whitespace-pre-wrap', {
                  hidden: generation === '',
                })}
              >
                {generation.replaceAll(' **', '\n**')}
              </p>
            </section>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
