import { ReactElement } from 'react';
import { getPB } from '../../_lib/pocketbase';
import Image from 'next/image';
import Editor from './Editor';

export default function InfoHome() {
  const pb = getPB();
  return <div className='m-16 max-md:m-8 flex flex-col gap-8'>
    <Editor />
  </div>

  // return <div className='m-16 max-md:m-8 flex flex-col gap-8'>
  //   <Section imageSrc='/mici.jpeg'>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg' reversed>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg'>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg' reversed>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg'>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg' reversed>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg'>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  //   <Section imageSrc='/mici.jpeg' reversed>
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis mauris, blandit a porta non, cursus eget velit. Vestibulum congue volutpat elementum. Vestibulum nec velit ultrices, commodo lorem ut, lacinia massa. Etiam a tincidunt nulla. Etiam non nibh ac mi tincidunt consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ultrices magna at malesuada tempus. Proin a eros cursus, volutpat erat ornare, sollicitudin enim. Nunc a dictum risus. Donec metus lacus, interdum non tincidunt vel, fermentum in est. Nullam pretium nunc odio, vitae varius arcu maximus sed.
  //   </Section>
  // </div>;
}

function Section({ imageSrc, children, reversed = false }: { imageSrc: string, children: ReactElement | string; reversed?: boolean }) {
  return <div className={`flex items-end gap-8 max-md:flex-col max-md:items-center ${reversed ? 'flex-row-reverse' : ''}`}>
    <Image height={200} width={200} src={imageSrc} alt={"info section image"} className='' />
    <div>{children}</div>
  </div>
}
