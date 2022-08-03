import { Fragment, useEffect, useState } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import React from 'react';
import { useDialogStore } from 'store/dialog';

export default function Dialog(props) {
  const dialogStore = useDialogStore();

  return (
    <Transition appear show={dialogStore.isOpen} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-10"
        onClose={dialogStore.onCancel}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <HeadlessDialog.Title
                  as="h1"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {dialogStore.title}
                </HeadlessDialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {dialogStore.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-row justify-between">
                  <button
                    type="button"
                    className="px-4 bg-primary dark:bg-primary"
                    onClick={dialogStore.onConfirm}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    className="button-outline border text-primary border-primary dark:text-primary dark:border-primary"
                    onClick={dialogStore.onCancel}
                  >
                    Annuleren
                  </button>
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
