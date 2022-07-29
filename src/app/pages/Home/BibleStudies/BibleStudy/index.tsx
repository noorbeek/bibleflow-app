import React, { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRightIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  ClipboardListIcon,
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

export default function BibleStudy() {
  const { id } = useParams();
  const [itemList, setItemList] = useState([]);

  const study = useQuery(
    ['study'],
    async () =>
      await Api.get(`/studies/${id}`, {
        order: 'createdAt desc',
        join: 'createdBy',
      }),
  );

  const studyComponents = useQuery(
    ['studyComponents'],
    async () =>
      await Api.get(`/studyComponents`, {
        where: `study:${id}`,
        order: 'sort',
        limit: 999,
      }),
    {
      onSuccess: data => {
        setItemList(data);
      },
    },
  );

  const refs = studyComponents?.data?.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const scrollTo = id =>
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = itemList.findIndex((item: any) => item.id === active.id);
      const newIndex = itemList.findIndex((item: any) => item.id === over.id);
      const newList = arrayMove(itemList, oldIndex, newIndex);

      setItemList(newList);

      newList.forEach((component: any, index) => {
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
        <div className="pb-5 border-b border-gray-200 dark:border-white/10">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1>{study?.data?.name}</h1>
              <p className="mt-1 text-sm mute truncate">
                Gemaakt door {study?.data?.createdBy?.name} op{' '}
                {study?.data?.createdAt}
              </p>
            </div>
          </div>
        </div>
        <div className="py-4 font-bold">{study?.data?.description}</div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemList}
            strategy={verticalListSortingStrategy}
          >
            {itemList?.map((component: any) => (
              <SortableItem key={component.id} id={component.id}>
                <div
                  ref={refs[component.id]}
                  className="relative p-4 hover:bg-primary/25 border-l-8 border-primary/10 dark:border-primary/10"
                >
                  {/* <DotsVerticalIcon className="w-6 h-6 absolute left-2" /> */}
                  {component.type === 'header' ? (
                    <div
                      className="py-4"
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
                  ) : null}
                  {component.type === 'text' ? (
                    <div
                      className="py-4"
                      dangerouslySetInnerHTML={{
                        __html: component.properties?.text,
                      }}
                    ></div>
                  ) : null}
                  {component.type === 'bibleQuery' ? (
                    <BibleQuery>{component.properties?.query}</BibleQuery>
                  ) : null}
                </div>
                <div className="p-2 my-2 hover:bg-primary/25">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-1 border-t border-black/10 dark:border-white/10"></div>
                    <PlusCircleIcon className="w-6 h-6 inline" />
                  </div>
                </div>
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
                {study?.data?.createdBy?.name}
              </div>
            </div>
          </section>
          <section className="pb-5 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <div className="text-xs font-semibold mute uppercase pb-5 tracking-wider border-b border-gray-200 dark:border-white/10">
                <ClipboardListIcon className="w-6 h-6 inline" /> Inhoudsopgave
              </div>
              <div className="my-6 text-sm">
                <ul role="list" className="-my-4 divide-x">
                  {itemList?.map((component: any) => (
                    <li key={component.id} className="truncate">
                      {component.type === 'header' ? (
                        <a
                          onClick={() => scrollTo(component.id)}
                          className={
                            (component?.properties?.level === 1
                              ? 'font-bold py-2 '
                              : '') +
                            'inline-block pl-' +
                            (component.properties.level
                              ? (component.properties.level - 1) * 3
                              : 0)
                          }
                        >
                          {component.properties?.level > 1 ? (
                            <ChevronRightIcon className="w-4 h-4 inline-block" />
                          ) : null}
                          {component.properties?.text}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
