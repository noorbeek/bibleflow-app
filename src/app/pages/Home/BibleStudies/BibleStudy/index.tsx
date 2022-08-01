import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardListIcon,
  HeartIcon as HeartSolidIcon,
} from '@heroicons/react/solid';
import {
  HeartIcon,
  BookmarkIcon,
  MenuAlt2Icon,
  QuestionMarkCircleIcon,
  MenuIcon,
  PencilAltIcon,
  BookOpenIcon,
} from '@heroicons/react/outline';
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
import Hyperlink from 'app/components/Hyperlink';
import Moment from 'moment';
import { useAppStore } from 'store/global';
import { InView } from 'react-intersection-observer';

export default function BibleStudy() {
  const { id } = useParams();
  const [studyComponents, setStudyComponents] = useState<StudyComponentModel[]>(
    [],
  );
  const me = useAppStore(state => state.me);
  const [editMode, setEditMode] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

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
        buildComponentList(data.response);
        setCanEdit(me?.role < 300 || me?.id === data.response?.id);
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
      // Clone the components list
      let newList = studyComponents;

      // Find positions of source and target components
      let startIndex = studyComponents.findIndex(
        (item: any) => item.id === active.id,
      );
      let endIndex = studyComponents.findIndex(
        (item: any) => item.id === over.id,
      );

      // Move all components within header level
      let moveComponents = 1;
      let withinLevel = 0;

      if (studyComponents[startIndex].type === 'header') {
        for (var i = 0; i < studyComponents.length; i++) {
          // Check if a level exists or set to low level
          let level = studyComponents[i].properties?.level
            ? parseInt(studyComponents[i].properties?.level)
            : 9;

          // Set limit level by active component
          if (studyComponents[i].id === active.id) {
            withinLevel = level;
          }
          // When set, break if higher level or remember for move
          else if (withinLevel) {
            if (level <= withinLevel) {
              break;
            }
            moveComponents++;
          }
        }
      }

      // Reorder list
      for (i = 0; i < moveComponents; i++) {
        newList = arrayMove(newList, startIndex++, endIndex++);
      }

      // Update state
      buildComponentList(newList);

      // Store new sort order
      newList.forEach((component: StudyComponentModel, index) => {
        if (index !== component.sort) {
          Api.put(`/studyComponents/${component.id}`, {
            sort: index,
          });
        }
      });
    }
  }

  function buildComponentList(componentList) {
    // Update section numbers
    let currentLevel: Array<number> = [];
    componentList.forEach((component: StudyComponentModel) => {
      if (component.type === 'header') {
        // Parse header level
        let level: number =
          component?.properties?.level && component?.properties?.level > 0
            ? component?.properties?.level - 1
            : 0;

        // Set new header number
        currentLevel[level] = currentLevel[level] ? currentLevel[level] + 1 : 1;

        // Strip sublevels
        currentLevel = currentLevel.slice(0, level + 1);

        // Set level name
        component.properties.levelName = currentLevel.join('.');
      }
    });

    // Update state
    setStudyComponents(componentList);
  }

  /**
   * Update state of component when is in/out of view
   * @param component
   * @param isInView
   */
  function setInView(component, isInView) {
    setStudyComponents(
      studyComponents.map(item => {
        return item.id === component.id
          ? Object.assign(item, { isInView: isInView })
          : item;
      }),
    );
  }

  let currentPadding = 0;

  return (
    <>
      <main className="lg:col-span-7 text-justify px-4 sm:px-0">
        <Header
          title={
            <div>
              {studyService?.data?.response?.name}
              {editMode ? (
                <button
                  className="float-right"
                  onClick={() => setEditMode(false)}
                >
                  <BookOpenIcon className="inline h-3 w-3" /> Leesmodus
                </button>
              ) : null}
              {!editMode && canEdit ? (
                <button
                  className="float-right"
                  onClick={() => setEditMode(true)}
                >
                  <PencilAltIcon className="inline h-3 w-3" /> Bewerkmodus
                </button>
              ) : null}
            </div>
          }
          subtitle={
            <>
              Auteur {studyService?.data?.response?.createdBy?.name + ' @ '}
              {studyService?.data?.response?.createdAt
                ? Moment(studyService?.data?.response?.createdAt).format()
                : ''}
              <br />
              <span className="mute text-xs mr-2">Rating</span>
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartIcon className="inline h-3 w-3" />
            </>
          }
        />
        <div className="pt-4 pb-8 font-bold">
          {studyService?.data?.response?.description}
        </div>
        <ul>
          {studyComponents?.map(component => (
            <li key={component.id}>
              <div
                ref={refs[component.id]}
                className={
                  'relative mb-8 border-primary/10 dark:border-primary/10 ' +
                  (component.type === 'header' ? ' ' : '') +
                  (component.type === 'bibleQuery' ? 'border-l-8 px-4 ' : '')
                }
              >
                <InView
                  as="div"
                  onChange={isInView => setInView(component, isInView)}
                >
                  {/* <MenuIcon className="w-6 h-6 absolute left-2" /> */}
                  {component.type === 'header' ? (
                    <Header
                      title={component.properties?.text}
                      subtitle={'Sectie ' + component.properties?.levelName}
                      level={
                        component.properties?.level
                          ? parseInt(component.properties?.level) + 1
                          : 2
                      }
                    />
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
                </InView>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <aside className="lg:col-span-3 px-4 sm:px-0">
        <div className="sticky top-0">
          <section className="pb-5 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <div className="text-xs font-semibold mute uppercase py-5 tracking-wider border-b border-gray-200 dark:border-white/10">
                <ClipboardListIcon className="w-6 h-6 inline" /> Inhoudsopgave
              </div>
              <div className="my-6 text-sm">
                {(() => {
                  // Build component index
                  let componentList = studyComponents?.map(
                    (component: any, index) => {
                      if (component.type === 'header') {
                        currentPadding = component.properties.level
                          ? component.properties.level - 1
                          : 0;
                      }
                      let isInView =
                        studyComponents.find(item => item?.isInView)?.id ===
                        component.id;
                      return (
                        <SortableItem
                          key={component.id}
                          id={component.id}
                          className={'truncate leading-6'}
                        >
                          <div
                            className={
                              'flex flex-row items-top ' +
                              (editMode ? 'cursor-pointer ' : '') +
                              (isInView
                                ? 'font-bold text-primary dark:text-primary hover:text-primary-400 hover:dark:text-primary-400'
                                : '')
                            }
                          >
                            <div>
                              {editMode ? (
                                <MenuIcon className="w-3 h-3 m-1 mr-2" />
                              ) : null}
                            </div>
                            <div className="truncate">
                              {component.type === 'header' ? (
                                <Hyperlink
                                  onClick={() => scrollTo(component.id)}
                                  className={
                                    (component?.properties?.level === 1
                                      ? 'font-bold py-2 '
                                      : 'block') +
                                    (editMode
                                      ? ' cursor-move'
                                      : ' truncate font-bold text-default dark:text-white') +
                                    (isInView
                                      ? ' font-bold text-primary dark:text-primary hover:text-primary-400 hover:dark:text-primary-400'
                                      : '')
                                  }
                                  style={{
                                    paddingLeft: currentPadding + 'em',
                                  }}
                                >
                                  {component.properties?.levelName +
                                    ') ' +
                                    component.properties?.text}
                                </Hyperlink>
                              ) : (
                                <Hyperlink
                                  onClick={() => scrollTo(component.id)}
                                  className={
                                    'block' +
                                    (editMode ? ' cursor-move' : '') +
                                    (isInView
                                      ? ' font-bold text-primary dark:text-primary hover:text-primary-400 hover:dark:text-primary-400'
                                      : '')
                                  }
                                  style={{
                                    paddingLeft: currentPadding + 1 + 'em',
                                  }}
                                >
                                  {(() => {
                                    switch (component.type) {
                                      case 'bibleQuery':
                                        return (
                                          <>
                                            <BookmarkIcon className="w-3 h-3 inline mr-2" />
                                            {component.properties?.query}
                                          </>
                                        );
                                      case 'text':
                                        return (
                                          <div className="truncate">
                                            <MenuAlt2Icon className="w-3 h-3 inline mr-2" />
                                            {component.properties?.text
                                              .substring(0, 50)
                                              .replace(/(<([^>]+)>)/gi, '')}
                                          </div>
                                        );
                                      default:
                                        return (
                                          <>
                                            <QuestionMarkCircleIcon className="w-3 h-3 inline mr-2" />
                                            {component.type}
                                          </>
                                        );
                                    }
                                  })()}
                                </Hyperlink>
                              )}
                            </div>
                          </div>
                        </SortableItem>
                      );
                    },
                  );

                  // Make sortabe if editmode is on
                  return editMode ? (
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
                        {componentList}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div>{componentList}</div>
                  );
                })()}
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
