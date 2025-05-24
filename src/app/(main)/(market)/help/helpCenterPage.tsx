'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';

type Question = {
  id: string;
  question: string;
  answer: string;
};
type Section = {
  section: string;
  section_order: number;
};
type QuestionSection = { [key: string]: Question[] };
export default function HelpCenterPage() {
  const [fanQuestions, setFanQuestions] =
    React.useState<QuestionSection | null>(null);
  const [creatorQuestions, setCreatorQuestions] =
    React.useState<QuestionSection | null>(null);

  React.useEffect(() => {
    const getHelp = async () => {
      const newFanQuestions: QuestionSection = {};
      const newCreatorQuestions: QuestionSection = {};
      const fanSections: Section[] = [];
      const creatorSections: Section[] = [];

      const helpRef: CollectionReference = collection(db, `help_center`);
      const q = query(
        helpRef,
        where('status', '==', 'Public'),
        orderBy('order', 'asc')
      );
      const helpData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);

      helpData.docs.map((item) => {
        if (item.data().type === 'fan') {
          if (
            !fanSections.find(
              (section) => section.section === item.data().section
            )
          ) {
            fanSections.push({
              section: item.data().section,
              section_order: item.data().section_order,
            });
          }
        } else if (item.data().type === 'creator') {
          if (
            !creatorSections.find(
              (section) => section.section === item.data().section
            )
          ) {
            creatorSections.push({
              section: item.data().section,
              section_order: item.data().section_order,
            });
          }
        }
      });
      fanSections.sort((a, b) => a.section_order - b.section_order);
      creatorSections.sort((a, b) => a.section_order - b.section_order);

      fanSections.map((section) => {
        newFanQuestions[section.section] = [];
      });
      creatorSections.map((section) => {
        newCreatorQuestions[section.section] = [];
      });
      helpData.docs.map((item) => {
        if (item.data().type === 'fan') {
          newFanQuestions[item.data().section].push({
            id: item.id,
            question: item.data().question,
            answer: item.data().answer,
          });
        } else if (item.data().type === 'creator') {
          newCreatorQuestions[item.data().section].push({
            id: item.id,
            question: item.data().question,
            answer: item.data().answer,
          });
        }
      });
      setFanQuestions(newFanQuestions);
      setCreatorQuestions(newCreatorQuestions);
    };

    getHelp();
  }, []);

  if (fanQuestions === null || creatorQuestions === null) {
    return <></>;
  }
  return (
    <section className="mx-auto w-full max-w-[1200px]">
      <section className="flex w-full flex-col items-center justify-between gap-4 px-4 py-4">
        <Tabs defaultValue="fans" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="fans">For Fans</TabsTrigger>
            <TabsTrigger value="creators">For Creators</TabsTrigger>
          </TabsList>

          <TabsContent value="fans" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Frequently Asked Questions for Fans
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about supporting your favorite
                creators and enjoying content.
              </p>
            </div>

            {Object.keys(fanQuestions).map((section) => {
              return (
                <section key={`fan-section-${section}`}>
                  <h3>{section}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {fanQuestions[section].map((question) => {
                      return (
                        <AccordionItem
                          key={`fan-question-${question.id}`}
                          value={question.id}
                        >
                          <AccordionTrigger>
                            {question.question}
                          </AccordionTrigger>
                          <AccordionContent asChild>
                            <p
                              className="text-muted-foreground whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: question.answer,
                              }}
                            ></p>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </section>
              );
            })}
          </TabsContent>

          <TabsContent value="creators" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Frequently Asked Questions for Creators
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about creating content, managing
                subscribers, and getting paid.
              </p>
            </div>

            {Object.keys(creatorQuestions).map((section) => {
              return (
                <section key={`fan-section-${section}`}>
                  <h3>{section}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {creatorQuestions[section].map((question) => {
                      return (
                        <AccordionItem
                          key={`fan-question-${question.id}`}
                          value={question.id}
                        >
                          <AccordionTrigger>
                            {question.question}
                          </AccordionTrigger>
                          <AccordionContent asChild>
                            <p
                              className="text-muted-foreground whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: question.answer,
                              }}
                            ></p>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </section>
              );
            })}
          </TabsContent>
        </Tabs>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Still need help</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you couldn&apos;t find the answer to your question, our support
              team is here to help.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild>
                <Link href="/send-feedback">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
