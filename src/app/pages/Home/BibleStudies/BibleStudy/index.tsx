import React, { createRef, useState } from 'react';
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
  PencilAltIcon,
  XIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/outline';
import Api from 'services/Api';
import { useNavigate, useParams } from 'react-router-dom';
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
import { StudyComponentModel, StudyModel } from 'models/Api';
import Header from 'app/components/Header';
import Hyperlink from 'app/components/Hyperlink';
import Moment from 'moment';
import { useAppStore } from 'store/global';
import { InView } from 'react-intersection-observer';
import TextareaAutosize from 'react-textarea-autosize';
import Selectbox from 'app/components/Selectbox';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDialogStore } from 'store/dialog';
import BibleStudyComponentAdd from './BibleStudyComponentAdd';
import Content from 'app/components/Content';
import usePrompt from 'hooks/Prompt';

export default function BibleStudy() {
  const { id } = useParams();
  let navigate = useNavigate();
  const me = useAppStore(state => state.user);
  const confirmDialog = useDialogStore(state => state.configure);
  const [forceUpdate, triggerForceUpdate] = useState(0);
  const [editMode, editModeState] = useState(false);
  const [canEdit, canEditState] = useState(false);
  const promptOnLeave = usePrompt(
    'Weet u zeker dat u de pagina wilt verlaten? Eventuele wijzigingen worden niet bewaard.',
    editMode,
  );
  const [study, studyState] = useState<StudyModel>({} as StudyModel);
  const [studyComponents, studyComponentsState] = useState<
    StudyComponentModel[]
  >([]);
  const [toRemoveStudyComponents, toRemoveStudyComponentsState] = useState<
    StudyComponentModel[]
  >([]);

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
    {
      // Update state on success
      onSuccess: data => {
        studyState(data.response);
        canEditState(me?.role < 300 || me?.id === data.response?.createdBy.id);
      },
    },
  );

  /**
   * Scroll to header from index by refs
   */
  const scrollTo = id => {
    if (id.toString().match(/index/gi)) {
      indexRef.current.scrollTop = refs[id].current.offsetTop - 100;
    } else if (id === 'bottom') {
      document?.querySelector('#app')?.scrollTo({
        top: indexRef.current.offsetTop,
        behavior: 'smooth',
      });
    } else if (id === 'top') {
      document?.querySelector('#app')?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      document?.querySelector('#app')?.scrollTo({
        top: refs[id].current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const indexRef: any = createRef();
  const topRef: any = createRef();
  const refs: any = studyComponentService?.data?.response?.reduce(
    (acc, value) => {
      acc[value.id] = React.createRef();
      acc[value.id + '-index'] = React.createRef();
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
    }
  }

  function buildComponentList(componentList) {
    // Update section numbers
    let currentLevel: Array<number> = [];
    componentList.forEach((component: StudyComponentModel, index) => {
      // Set new index
      if (component.sort !== index) {
        component.isChanged = true;
        component.sort = index;
      }
      // Calculate header level
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
    studyComponentsState(componentList);

    // Force component to rerender
    triggerForceUpdate(new Date().getTime());
  }

  function updateStudy(study: StudyModel) {
    studyState({ ...study, isChanged: true });
  }

  function updateStudyComponent(component: StudyComponentModel) {
    buildComponentList(
      studyComponents.map(item => {
        return item.id === component.id
          ? { ...component, isChanged: true }
          : item;
      }),
    );
  }

  function removeStudyComponent(component: StudyComponentModel) {
    buildComponentList(
      studyComponents.filter(item => item.id !== component.id),
    );
    toRemoveStudyComponentsState([...toRemoveStudyComponents, component]);
  }

  function addStudyComponent(type: string, studyComponentsIndex: number) {
    if (!type) return;

    let newList = studyComponents;
    let newComponent = { properties: {} } as StudyComponentModel;

    switch (type) {
      case 'header':
        newComponent.properties.level = 1;
        break;
      case 'text':
        newComponent.properties.text = 'Nieuw component';
        break;
      case 'bibleQuery':
        newComponent.properties.query = 'Gen 1:1';
        break;
    }

    newList.splice(studyComponentsIndex, 0, {
      ...newComponent,
      id: new Date().getTime(),
      isNew: true,
      sort: 0,
      type: type,
      study: study.id,
    });

    buildComponentList(newList);
  }

  /**
   * Update state of component when is in/out of view
   * @param component
   * @param isInView
   */
  function setInView(component, isInView) {
    if (isInView) {
      scrollTo(component.id + '-index');
    }
    studyComponentsState(
      studyComponents.map(item => {
        return item.id === component.id
          ? Object.assign(item, { isInView: isInView })
          : item;
      }),
    );
  }

  function save() {
    // Store study
    if (study?.isChanged) {
      Api.put(`/studies/${study.id}`, study);
    }

    // Store components
    studyComponents.forEach((component: StudyComponentModel, index) => {
      if (component?.isNew) {
        Api.post(`/studyComponents`, component).then(data => {
          updateStudyComponent({
            ...component,
            id: data?.response?.id,
          });
        });
      } else if (component.id && component?.isChanged) {
        Api.put(`/studyComponents/${component.id}`, component);
      }
    });

    // Remove components
    toRemoveStudyComponents.forEach((component: StudyComponentModel, index) => {
      Api.remove(`/studyComponents/${component.id}`);
    });

    // Disable editing mode
    editModeState(false);
    confirmDialog({ isOpen: false });
  }

  function remove() {
    confirmDialog({
      title: 'Weet u zeker dat u de studie wilt verwijderen?',
      description: 'Dit kan niet ongedaan gemaakt worden.',
      isOpen: true,
      onConfirm: () => {
        // Remove components
        studyComponents.forEach((component: StudyComponentModel, index) => {
          if (!component?.isNew) {
            Api.remove(`/studyComponents/${component.id}`);
          }
        });

        // Remove study & move to root
        Api.remove(`/studies/${study.id}`, study).then(() => {
          navigate('/studies');
        });

        // Disable dialog
        editModeState(false);
        confirmDialog({ isOpen: false });
      },
    });
  }

  function cancel() {
    confirmDialog({
      title: 'Weet u zeker dat u wilt annuleren?',
      description: 'Alle wijzigingen worden ongedaan gemaakt als u annuleert!',
      isOpen: true,
      onConfirm: () => {
        // Refresh states from store
        studyService.refetch();
        studyComponentService.refetch();

        // Disable editing mode
        editModeState(false);
        confirmDialog({ isOpen: false });
      },
    });
  }

  let currentPadding = 0;

  return (
    <div className="flex flex-col sm:flex-row col-span-10">
      <main className="basis-3/5">
        <Header
          className="px-4 sm:px-0"
          title={<div ref={topRef}>{study?.name}</div>}
          subtitle={
            <>
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
              <HeartIcon className="inline h-3 w-3" />
              {' | ' + study?.createdBy?.name + ' @ '}
              {study?.createdAt ? Moment(study?.createdAt).format() : ''}
            </>
          }
        />
        {editMode ? (
          <>
            <label>Studienaam</label>
            <input
              onChange={evt =>
                updateStudy({ ...study, name: evt.target.value })
              }
              type="text"
              value={study?.name}
            />
          </>
        ) : null}
        <div className="pt-4 pb-8 font-bold px-4 sm:px-0">
          {editMode ? (
            <div className="py-4">
              <label>Samenvatting</label>
              <TextareaAutosize
                onChange={evt =>
                  updateStudy({ ...study, description: evt.target.value })
                }
                value={study?.description}
              />
            </div>
          ) : (
            study?.description
          )}
        </div>
        <Content>
          {editMode ? (
            <Header
              className="border-none"
              level={2}
              title="Componenten"
              subtitle="Bijbelstudie componenten bewerken"
            />
          ) : null}
          {editMode ? (
            <BibleStudyComponentAdd index={0} onChange={addStudyComponent} />
          ) : null}
          <ul>
            {studyComponents?.map((component, studyComponentsIndex) => (
              <li key={component.id}>
                <div
                  ref={refs[component.id]}
                  className={
                    'relative mt-4 border-primary/10 dark:border-primary/10 '
                  }
                >
                  {editMode ? (
                    <div className="font-bold py-4 flex flex-row justify-between">
                      <div>
                        {(() => {
                          switch (component.type) {
                            case 'text':
                              return 'Tekst';
                            case 'bibleQuery':
                              return 'Bijbelquery';
                            case 'header':
                              return (
                                'Koptekst ' + component?.properties?.levelName
                              );
                            default:
                              return component.type;
                          }
                        })()}
                      </div>
                      <button
                        type="button"
                        className="button-outline"
                        onClick={evt => removeStudyComponent(component)}
                      >
                        <TrashIcon className="inline h-3 w-3" />
                      </button>
                    </div>
                  ) : null}
                  {(() => {
                    let componentContent = <></>;
                    if (component.type === 'header') {
                      componentContent = editMode ? (
                        <div className="flex flex-row space-x-2">
                          <input
                            onChange={evt =>
                              updateStudyComponent({
                                ...component,
                                properties: {
                                  ...component.properties,
                                  text: evt.target.value,
                                },
                              })
                            }
                            type="text"
                            value={component.properties?.text}
                          />
                          <Selectbox
                            selected={
                              component.properties?.level
                                ? component.properties?.level
                                : 1
                            }
                            onChange={option =>
                              updateStudyComponent({
                                ...component,
                                properties: {
                                  ...component.properties,
                                  level: option.id,
                                },
                              })
                            }
                            options={Array.from(
                              { length: 6 },
                              (_, i) => i + 1,
                            ).map(i => {
                              return {
                                id: i,
                                text: 'Niveau ' + i,
                                description: '',
                              };
                            })}
                          />
                        </div>
                      ) : (
                        <Header
                          className="border-none mb-0 pb-0"
                          title={component.properties?.text}
                          subtitle={
                            <span className="text-xs">
                              {editMode
                                ? ''
                                : 'Sectie ' + component.properties?.levelName}
                            </span>
                          }
                          level={
                            component.properties?.level
                              ? parseInt(component.properties?.level) + 1
                              : 2
                          }
                        />
                      );
                    } else if (component.type === 'text') {
                      componentContent = editMode ? (
                        <div className="text-black text-sm">
                          <CKEditor
                            editor={ClassicEditor}
                            data={component.properties?.text}
                            onChange={(evt, editor) =>
                              updateStudyComponent({
                                ...component,
                                properties: {
                                  ...component.properties,
                                  text: editor.getData(),
                                },
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div
                          className="pb-4 text-justify"
                          dangerouslySetInnerHTML={{
                            __html: component.properties?.text,
                          }}
                        ></div>
                      );
                    } else if (component.type === 'bibleQuery') {
                      componentContent = (
                        <div>
                          <div className="pb-4">
                            {editMode ? (
                              <input
                                onChange={evt =>
                                  updateStudyComponent({
                                    ...component,
                                    properties: {
                                      ...component.properties,
                                      query: evt.target.value,
                                    },
                                  })
                                }
                                placeholder="Gen 1:1-10, levend water"
                                type="text"
                                value={component.properties?.query}
                              />
                            ) : null}
                          </div>
                          <div className="bg-slate-50 dark:bg-white/5 p-4 sm:p-6 mb-8">
                            <BibleQuery
                              limit={editMode ? 3 : 10}
                              className="text-sm"
                            >
                              {component.properties?.query}
                            </BibleQuery>
                          </div>
                        </div>
                      );
                    }
                    return editMode || component.type === 'header' ? (
                      <InView
                        as="div"
                        onChange={isInView => setInView(component, isInView)}
                      >
                        {componentContent}
                      </InView>
                    ) : (
                      <div>{componentContent}</div>
                    );

                    // return (
                    //   <InView
                    //     as="div"
                    //     onChange={isInView => setInView(component, isInView)}
                    //   >
                    //     {componentContent}
                    //   </InView>
                    // );
                  })()}
                  {editMode ? (
                    <BibleStudyComponentAdd
                      index={studyComponentsIndex + 1}
                      onChange={addStudyComponent}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Content>
      </main>
      <aside
        ref={indexRef}
        className="basis-2/5 sticky p-4 sm:pl-8 sm:py-4 top-0 h-screen overflow-y-auto overflow-x-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
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
                        disabled={!editMode}
                        className={
                          'truncate leading-4 ' +
                          (component.type !== 'header' && !editMode
                            ? 'hidden '
                            : '') +
                          (component.type === 'header'
                            ? component?.properties?.level === 1
                              ? 'pt-2 '
                              : 'pt-1 text-xs '
                            : '')
                        }
                      >
                        <div ref={refs[component.id + '-index']}>
                          {component.type === 'header' ? (
                            <Hyperlink
                              onClick={() => scrollTo(component.id)}
                              className={
                                'truncate ' +
                                (component?.properties?.level === 1
                                  ? 'font-bold '
                                  : '') +
                                (isInView
                                  ? ' font-bold text-primary dark:text-primary hover:text-primary-400 hover:dark:text-primary-400'
                                  : '')
                              }
                              style={{
                                paddingLeft: currentPadding + 'em',
                              }}
                            >
                              {component.properties?.text}
                            </Hyperlink>
                          ) : (
                            <Hyperlink
                              onClick={() => scrollTo(component.id)}
                              className={
                                'block opacity-75 hover:opacity-100 text-xs truncate ' +
                                (isInView
                                  ? ' text-primary dark:text-primary hover:text-primary-400 hover:dark:text-primary-400'
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
      </aside>
      {canEdit ? (
        <div className="fixed bottom-0 left-0 right-0 flex p-4 flex-row justify-center space-x-2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent">
          <div className="flex flex-row justify-between w-full max-w-screen-2xl">
            {editMode ? (
              <button className="button-outline" onClick={cancel}>
                <XIcon className="h-5 w-5" />
                <span className="hidden sm:block"> Annuleren</span>
              </button>
            ) : (
              <button className="button-outline button-danger" onClick={remove}>
                <TrashIcon className="h-5 w-5" />
                <span className="hidden sm:block"> Verwijderen</span>
              </button>
            )}
            <div className="grow flex justify-center space-x-2">
              <button
                className="button-transparent"
                onClick={() => scrollTo('top')}
              >
                <ArrowUpIcon className="h-5 w-5" />
              </button>
              <button
                className="button-transparent block sm:hidden"
                onClick={() => scrollTo('bottom')}
              >
                <ArrowDownIcon className="h-5 w-5" />
              </button>
            </div>
            {editMode ? (
              <button onClick={save}>
                <CheckCircleIcon className="h-5 w-5" />
                <span className="hidden sm:block"> Opslaan</span>
              </button>
            ) : (
              <button onClick={() => editModeState(true)}>
                <PencilAltIcon className="h-5 w-5" />
                <span className="hidden sm:block"> Bewerken</span>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
