'use client'

import Link from "next/link";
import Details from "./Details";
import { navBarItems } from "@/app/_constans/navBar";
import BreadCrumb from "@/app/_components/navigation/BreadCrumb";
import { useGlobals, useIsWorkspaceBusy } from "@/lib/dataHooks";
import Image from "next/image";

export default function FirstSteps() {
  const globals = useGlobals()
  const isLoading = useIsWorkspaceBusy();

  return (
    <div className='m-16 max-md:m-8'>
      <BreadCrumb items={[navBarItems[1]]} />
      <h2 className='text-2xl col-span-full pb-8'>
        First steps
      </h2>
      <ul className="pb-8">
        <li>You need to create a new public repository by using this <Link href={globals.primary_project || 'https://github.com'} className='text-primary hover:underline'>repo</Link> as a template</li>
        <li className="flex items-center">You should create a new repository by clicking this button <Image alt='cat-404' src={'/use-this-template-btn.png'} width={150} height={30} /> and filling up the necessary details for repository creation</li>
        <li>After creating the repository, you should go to <Link href='/settings' className='text-primary hover:underline'>/settings</Link> and set your repo in the <span className='font-semibold'>Used repo</span> section</li>
        <li>Then you can use this repo to solve the task in your new repository</li>
      </ul>
      <Details />
      <h2 className='text-2xl col-span-full pb-8'>
        {
          isLoading ?
            'Please be patient while we are loading your first run results...' :
            'There are no registered run results, you should commit your first change'
        }
      </h2>
    </div>
  );
}