import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  InformationCircleIcon,
  ClipboardListIcon,
  BookmarkIcon,
} from '@heroicons/react/solid';
import Api from 'services/Api';
import { useParams } from 'react-router-dom';
import BibleQuery from 'app/components/bible/BibleQuery';
import { SortableItem } from 'app/components/SortableItem';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { StudyComponentModel } from 'models/Api';
import Header from 'app/components/Header';
import Link from 'app/components/Link';

export default function BibleStudy() {
  const { id } = useParams();
  const [studyComponents, setStudyComponents] = useState<StudyComponentModel[]>(
    [],
  );

  /**
   * Data services
   */
  const studyComponentService = useQuery(
    ['studyComponents'],
    async () =>
      await Api.get(`/studyComponents`, {
        where: `study:${id}`,
        order: 'sort',
        limit: 999,
      }),
    {
      // Update state on success
      onSuccess: data => {
        let currentLevel: Array<number> = [];
        data.response?.forEach((component: StudyComponentModel) => {
          if (component.type === 'header') {
            // Parse header level
            let level: number =
              component?.properties?.level && component?.properties?.level > 0
                ? component?.properties?.level - 1
                : 0;

            // Set new header number
            currentLevel[level] = currentLevel[level]
              ? currentLevel[level] + 1
              : 1;

            // Strip sublevels
            currentLevel = currentLevel.slice(0, level + 1);

            // Set level name
            component.properties.levelName = currentLevel.join('.');
          }
        });
        setStudyComponents(data.response);
      },
    },
  );

  const studyService = useQuery(
    ['study'],
    async () =>
      await Api.get(`/studies/${id}`, {
        order: 'createdAt desc',
        join: 'createdBy',
      }),
  );

  /**
   * Scroll to header from index by refs
   */
  const scrollTo = id =>
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  const refs: any = studyComponentService?.data?.response?.reduce(
    (acc, value) => {
      acc[value.id] = React.createRef();
      return acc;
    },
    {},
  );

  /**
   * Drag and drop
   */

  const dndSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find positions and create new list
      const oldIndex = studyComponents.findIndex(
        (item: any) => item.id === active.id,
      );
      const newIndex = studyComponents.findIndex(
        (item: any) => item.id === over.id,
      );
      const newList = arrayMove(studyComponents, oldIndex, newIndex);

      // Update state
      setStudyComponents(newList);

      // Update SQL
      newList.forEach((component: StudyComponentModel, index) => {
        if (index !== component.sort) {
          Api.put(`/studyComponents/${component.id}`, {
            sort: index,
          });
        }
      });
    }
  }

  return (
    <>
      <main className="lg:col-span-7 text-justify px-4 sm:px-0">
        <Header
          title={studyService?.data?.response?.name}
          subtitle={
            'Gemaakt door ' +
            studyService?.data?.response?.createdBy?.name +
            ' op ' +
            studyService?.data?.response?.createdAt
          }
        />
        <div className="py-4 font-bold">
          {studyService?.data?.response?.description}
        </div>
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          sensors={dndSensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={studyComponents}
            strategy={verticalListSortingStrategy}
          >
            {studyComponents?.map(component => (
              <SortableItem key={component.id} id={component.id}>
                <div
                  ref={refs[component.id]}
                  className={
                    'relative py-2 hover:bg-primary/25 border-primary/10 dark:border-primary/10 ' +
                    (component.type === 'header' ? ' ' : '') +
                    (component.type === 'bibleQuery' ? 'border-l-8 px-4 ' : '')
                  }
                >
                  {/* <DotsVerticalIcon className="w-6 h-6 absolute left-2" /> */}
                  {component.type === 'header' ? (
                    <div className="py-4 pb-8 mb-8 border-b border-black/10 dark:border-white/10">
                      <div
                        className="flex-grow"
                        dangerouslySetInnerHTML={{
                          __html:
                            '<h' +
                            (component.properties?.level > 0 &&
                            component.properties?.level < 6
                              ? component.properties?.level + 1
                              : 2) +
                            '>' +
                            component.properties?.text +
                            '</h' +
                            (component.properties?.level > 0 &&
                            component.properties?.level < 6
                              ? component.properties?.level + 1
                              : 2) +
                            '>',
                        }}
                      ></div>
                      <div className="mute text-sm">
                        Sectie {component.properties?.levelName}
                      </div>
                      {/* <BookmarkIcon className="w-6 h-6 inline" /> */}
                    </div>
                  ) : null}
                  {component.type === 'text' ? (
                    <div
                      className="pb-4"
                      dangerouslySetInnerHTML={{
                        __html: component.properties?.text,
                      }}
                    ></div>
                  ) : null}
                  {component.type === 'bibleQuery' ? (
                    <BibleQuery className="text-sm">
                      {component.properties?.query}
                    </BibleQuery>
                  ) : null}
                </div>
                {/* <div className="p-2 my-2 hover:bg-primary/25">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-1 border-t border-black/10 dark:border-white/10"></div>
                    <PlusCircleIcon className="w-6 h-6 inline" />
                  </div>
                </div> */}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </main>
      <aside className="lg:col-span-3 px-4 sm:px-0">
        <div className="sticky top-0 ">
          <section className="pb-4 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <div className="text-xs font-semibold mute uppercase py-5 tracking-wider border-b border-gray-200 dark:border-white/10">
                <InformationCircleIcon className="w-6 h-6 inline" /> Over deze
                studie
              </div>
              <div className="my-6 text-sm">
                <label className="mute text-xs">Auteur</label>
                <br />
                {studyService?.data?.response?.createdBy?.name}
              </div>
            </div>
          </section>
          <section className="pb-5 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <div className="text-xs font-semibold mute uppercase pb-5 tracking-wider border-b border-gray-200 dark:border-white/10">
                <ClipboardListIcon className="w-6 h-6 inline" /> Inhoudsopgave
              </div>
              <div className="my-6 text-sm">
                <ul role="list" className="-my-4">
                  {studyComponents?.map((component: any) => {
                    if (component.type === 'header') {
                      return (
                        <li key={component.id} className="truncate">
                          {component.type === 'header' ? (
                            <Link
                              onClick={() => scrollTo(component.id)}
                              className={
                                (component?.properties?.level === 1
                                  ? 'font-bold py-2 '
                                  : '') + 'inline-block leading-6'
                              }
                              style={{
                                paddingLeft:
                                  (component.properties.level
                                    ? component.properties.level - 1
                                    : 0) + 'em',
                              }}
                            >
                              {/* {component.properties?.level > 1 ? (
                            <ChevronRightIcon className="w-4 h-4 inline-block" />
                          ) : null} */}
                              {component.properties?.levelName +
                                '. ' +
                                component.properties?.text}
                            </Link>
                          ) : null}
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
